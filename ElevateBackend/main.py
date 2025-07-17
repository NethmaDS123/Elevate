# main.py
import os
import uuid
import asyncio
import logging
from datetime import datetime, UTC

from fastapi import FastAPI, Request, Header, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json 
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Check for required environment variables
required_env_vars = ["OPENAI_API_KEY", "MONGODB_URI"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]

# For development, we'll set placeholder values and continue with warnings
if missing_vars:
    print(f"\n⚠️  WARNING: Missing environment variables: {', '.join(missing_vars)}")
    print("⚠️  Some features may not work correctly without these variables.")
    print("⚠️  Please set these variables in your .env file for full functionality.")
    print("⚠️  Setting temporary development values to allow the server to start.\n")
    
    # Set placeholder values for development
    if "OPENAI_API_KEY" in missing_vars:
        os.environ["OPENAI_API_KEY"] = "sk-dummy-key-for-development"
        print("✓ Set placeholder OPENAI_API_KEY (resume optimization will not work)")
    if "MONGODB_URI" in missing_vars:
        os.environ["MONGODB_URI"] = "mongodb://localhost:27017/elevate"
        print("✓ Set placeholder MONGODB_URI (database operations will not work)")
    print()

from features.project_evaluation import ProjectEvaluator
from features.learning_paths import LearningPathways
from features.resume_optimization import ResumeOptimizer 
from features.interview_preparation import InterviewPreparation
from features.role_transition import RoleTransition 
from features.skill_benchmark import SkillBenchmark
from features.resume_extraction import ResumeExtractor
from database import (
    fetch_learning_pathway_results,
    fetch_optimization_results,
    store_evaluation_result,
    store_optimization_results,
    store_learning_pathway_result,
    store_interview_analysis,
    store_interview_feedback,
    store_role_transition,
    store_skill_benchmark,
    users_collection 
)
from auth import verify_google_token  

# -------------------------
# Logging Configuration
# -------------------------
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("main")

# -------------------------
# FastAPI App
# -------------------------
app = FastAPI()
# Adding CORS middleware to allow all origins, credentials, methods and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint to check if the server is running
@app.get("/")
@app.head("/")
def read_root():
    return {"message": "Hello, World!"}

# -------------------------
# Feature Instances
# -------------------------
project_evaluator         = ProjectEvaluator()
resume_optimizer          = ResumeOptimizer()
learning_pathways_instance= LearningPathways()
interview_preparation_instance   = InterviewPreparation()
role_transition_instance  = RoleTransition()
skill_benchmark_instance = SkillBenchmark()
resume_extractor = ResumeExtractor()

# Setting the maximum number of concurrent tasks
MAX_CONCURRENT_TASKS = 5
semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)


# ----------------
# Dashboard Endpoint
# ----------------


@app.get("/dashboard")
async def get_dashboard(authorization: str = Header(None)):
    logger.info(f"➡️  /dashboard called; Authorization={authorization!r}")

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token")
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)
        user_id   = user_info["sub"]
        logger.info(f"✔️  Authenticated user_id={user_id}")
    except Exception:
        logger.warning("❌  Invalid auth token on /dashboard")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    # 1) Latest resume optimization
    resume_entry = fetch_optimization_results(user_id) or {}
    result       = resume_entry.get("result", {})
    analysis     = result.get("analysis", {})

    # 2) Latest learning pathway
    lp_entry       = fetch_learning_pathway_results(user_id)
    learning_paths = []
    if lp_entry and lp_entry.get("status") == "completed":
        learning_paths.append({
            "title":    lp_entry["topic"],
            "progress": 100,
        })

    # 3) Feature usage counts
    user_doc = users_collection.find_one({"_id": user_id}, {"features": 1}) or {}
    feats    = user_doc.get("features", {})
    feature_usage = {
        "resumeOptimizer":   len(feats.get("resumeOptimizer", [])),
        "learningPathways":  len(feats.get("learningPathways", [])),
        "interviewPrep":     len(feats.get("interviewAnalysis", [])),
        "projectEvaluation": len(feats.get("projectEvaluation", [])),
        "skillGapAnalysis":  len(feats.get("skillBenchmark", [])),
        "roleTransition":    len(feats.get("roleTransition", [])),
    }

    # 4) Return exactly what the frontend expects
    return {
        "user": {
            "name":         user_info.get("name", user_info.get("email", "User")),
            "featureUsage": feature_usage,
        },
        "resumeHealth": {
            "score":        result.get("ats_score", 0),
            "improvements": len(analysis.get("recommendations", [])),
            "lastUsed":     resume_entry.get("updatedAt"),
        },
        "learningPaths": learning_paths,
    }
# ----------------
# Project Evaluation Endpoint
# ----------------

@app.post("/evaluate_project")
async def evaluate_project(request: Request, authorization: str = Header(None)):
    # Check if authorization token is present
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    
    # Extract token from Authorization header
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify the token and extract user information
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception as e:
        logger.warning(f"[unauthenticated] evaluate_project blocked: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    # Extract project description from request body
    body = await request.json()
    project_description = body.get("project_description")
    if not project_description:
        raise HTTPException(status_code=400, detail="Project description is required.")

    # Generate a unique evaluation ID and timestamp
    evaluation_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)

    # Create initial "processing" entry in the database
    store_evaluation_result(user_id, {
        "evaluation_id": evaluation_id,
        "project_description": project_description,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp
    })

    # Use semaphore to limit concurrent tasks
    async with semaphore:
        try:
            logger.info(f"[{user_id}] Starting project evaluation (id={evaluation_id})")

            # Run the project evaluator in a separate thread
            evaluation: dict = await asyncio.get_event_loop().run_in_executor(
                None,
                project_evaluator.evaluate,
                user_id,
                project_description
            )

            logger.info(f"[{user_id}] Completed project evaluation (id={evaluation_id}) — score={evaluation.get('overall_score')}")

            # Update the evaluation status and result in the database
            users_collection.update_one(
                {"_id": user_id, "features.projectEvaluation.evaluation_id": evaluation_id},
                {"$set": {
                    "features.projectEvaluation.$.status":     "completed",
                    "features.projectEvaluation.$.evaluation": evaluation,
                    "features.projectEvaluation.$.updatedAt":  datetime.now(UTC)
                }}
            )

            # Return the evaluation dict
            return {
                "evaluation_id": evaluation_id,
                "evaluation": evaluation
            }
            
        except Exception as e:
            # Log and handle any exceptions during project evaluation
            logger.exception(f"[{user_id}] Project evaluation failed (id={evaluation_id})")
            users_collection.update_one(
                {"_id": user_id, "features.projectEvaluation.evaluation_id": evaluation_id},
                {"$set": {
                    "features.projectEvaluation.$.status":    "failed",
                    "features.projectEvaluation.$.error":     str(e),
                    "features.projectEvaluation.$.updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(status_code=500, detail="Internal error during project evaluation")

# ----------------
# Resume Optimization Endpoint
# ----------------
@app.post("/optimize_resume")
async def optimize_resume(request: Request, authorization: str = Header(None)):
    # Check if authorization token is present
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify the token and extract user information
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception:
        logger.warning("Invalid auth token on optimize_resume")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    # Extract resume_text and job_description from request body
    body = await request.json()
    resume_text = body.get("resume_text")
    job_description = body.get("job_description")
    format_details = body.get("format_details")  # This can be None if not provided
    
    # Validate if both resume_text and job_description are provided
    if not resume_text or not job_description:
        raise HTTPException(
            status_code=400,
            detail="Both `resume_text` and `job_description` are required."
        )

    # Generate a unique optimization_id and record the start time
    optimization_id = str(uuid.uuid4())
    now = datetime.now(UTC)
    # Store initial optimization details in the database
    store_optimization_results(user_id, {
        "optimization_id": optimization_id,
        "status": "processing",
        "createdAt": now,
        "updatedAt": now,
        "resume_snapshot": resume_text[:1000] + "..." if len(resume_text) > 1000 else resume_text,
        "jd_snapshot": job_description[:500] + "..." if len(job_description) > 500 else job_description
    })

    # Use semaphore to limit concurrent tasks
    async with semaphore:
        try:
            logger.info(f"[{user_id}] Starting resume optimization (id={optimization_id})")
            # Run the resume optimizer in a separate thread
            result: dict = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: resume_optimizer.optimize(
                    user_id,
                    resume_text,
                    job_description,
                    format_details
                )
            )
            logger.info(f"[{user_id}] Completed resume optimization (id={optimization_id}) ats_score={result.get('ats_score')}")

            # Update the optimization status and result in the database
            users_collection.update_one(
                {"_id": user_id, "features.resumeOptimizer.optimization_id": optimization_id},
                {"$set": {
                    "features.resumeOptimizer.$.status":    "completed",
                    "features.resumeOptimizer.$.result":    result,
                    "features.resumeOptimizer.$.updatedAt": datetime.now(UTC)
                }}
            )

            return {
                "optimization_id": optimization_id,
                **result
            }
        except Exception as e:
            # Log and handle any exceptions during resume optimization
            logger.exception(f"[{user_id}] Resume optimization failed (id={optimization_id}): {str(e)}")
            users_collection.update_one(
                {"_id": user_id, "features.resumeOptimizer.optimization_id": optimization_id},
                {"$set": {
                    "features.resumeOptimizer.$.status":    "failed",
                    "features.resumeOptimizer.$.error":     str(e),
                    "features.resumeOptimizer.$.updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(status_code=500, detail=f"Internal error during resume optimization: {str(e)}")

# ----------------
# Learning Pathways Endpoint
# ----------------
@app.post("/learning_pathways")
async def get_learning_pathways(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    # Extract token from authorization header
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify the token and extract user information
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception:
        logger.warning("Invalid auth token on learning_pathways")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    # Extract topic from request body
    body = await request.json()
    topic = body.get("topic")
    if not topic:
        raise HTTPException(status_code=400, detail="`topic` is required.")

    # Generate a unique pathway ID and initialize the learning pathway
    pathway_id = str(uuid.uuid4())
    now = datetime.now(UTC)
    store_learning_pathway_result(user_id, {
        "pathway_id": pathway_id,
        "topic": topic,
        "status": "processing",
        "createdAt": now,
        "updatedAt": now
    })

    async with semaphore:
        try:
            logger.info(f"[{user_id}] Starting generation for topic='{topic}' (pathway_id={pathway_id})")
            # Generate the learning pathway
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                learning_pathways_instance.generate_pathway,
                user_id,
                topic
            )

            # Update the learning pathway status and result in the database
            users_collection.update_one(
                {"_id": user_id, "features.learningPathways.pathway_id": pathway_id},
                {"$set": {
                    "features.learningPathways.$.status":     "completed",
                    "features.learningPathways.$.result":     result["learning_pathway"],
                    "features.learningPathways.$.updatedAt":  datetime.now(UTC)
                }}
            )

            logger.info(f"[{user_id}] Completed generation for pathway_id={pathway_id}")
            return result

        except Exception as e:
            # Log and handle any exceptions during learning pathway generation
            logger.exception(f"[{user_id}] Failed to generate pathway (pathway_id={pathway_id})")
            users_collection.update_one(
                {"_id": user_id, "features.learningPathways.pathway_id": pathway_id},
                {"$set": {
                    "features.learningPathways.$.status":     "failed",
                    "features.learningPathways.$.error":      str(e),
                    "features.learningPathways.$.updatedAt":  datetime.now(UTC)
                }}
            )
            # return a generic 500 to the client
            raise HTTPException(status_code=500, detail="Internal error generating learning pathway")

# ----------------
# Interview Question Analysis Endpoint
# ----------------
@app.post("/analyze_question")
async def analyze_question(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    
    # Extract and verify the token
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)  # Verify the token and get user info
        user_id = user_info["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    # Extract question from request body
    body = await request.json()
    question = body.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")
    
    # Generate unique ID for this analysis and set initial data
    analysis_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)
    initial_data = {
        "analysis_id": analysis_id,
        "question": question,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp
    }
    store_interview_analysis(user_id, initial_data)

    async with semaphore:
        try:
            # Analyze the question
            analysis = await asyncio.get_event_loop().run_in_executor(
                None, interview_preparation_instance.analyze_question, user_id, question
            )
            
            # Update the analysis status and result
            users_collection.update_one(
                {"_id": user_id, "features.interviewAnalysis.analysis_id": analysis_id},
                {"$set": {
                    "features.interviewAnalysis.$.status": "completed",
                    "features.interviewAnalysis.$.analysis": analysis,
                    "features.interviewAnalysis.$.updatedAt": datetime.now(UTC)
                }}
            )
            
            return {"analysis": analysis, "analysis_id": analysis_id}
            
        except Exception as e:
            # Handle any exceptions during analysis
            users_collection.update_one(
                {"_id": user_id, "features.interviewAnalysis.analysis_id": analysis_id},
                {"$set": {
                    "features.interviewAnalysis.$.status": "failed",
                    "features.interviewAnalysis.$.error": str(e),
                    "features.interviewAnalysis.$.updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(status_code=500, detail=str(e))

# ----------------
# Interview Feedback Endpoint
# ----------------
@app.post("/feedback")
async def interview_feedback(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    
    # Extract token from authorization header
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify the token and extract user information
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    # Extract question and user_answer from request body
    body = await request.json()
    question = body.get("question")
    user_answer = body.get("user_answer")
    if not question or not user_answer:
        raise HTTPException(status_code=400, detail="Both question and user_answer are required.")

    # Generate unique ID for this feedback
    feedback_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)
    
    # Create initial feedback entry
    initial_data = {
        "feedback_id": feedback_id,
        "question": question,
        "user_answer": user_answer,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp
    }
    store_interview_feedback(user_id, initial_data)

    async with semaphore:
        try:
            # Process feedback asynchronously
            feedback = await asyncio.get_event_loop().run_in_executor(
                None, interview_preparation_instance.feedback_on_answer, user_id, question, user_answer
            )
            
            # Update feedback entry with the result
            users_collection.update_one(
                {"_id": user_id, "features.interviewFeedback.feedback_id": feedback_id},
                {"$set": {
                    "features.interviewFeedback.$.status": "completed",
                    "features.interviewFeedback.$.feedback": feedback,
                    "features.interviewFeedback.$.updatedAt": datetime.now(UTC)
                }}
            )
            
            return {"feedback": feedback, "feedback_id": feedback_id}
            
        except Exception as e:
            users_collection.update_one(
                {"_id": user_id, "features.interviewFeedback.feedback_id": feedback_id},
                {"$set": {
                    "features.interviewFeedback.$.status": "failed",
                    "features.interviewFeedback.$.error": str(e),
                    "features.interviewFeedback.$.updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(status_code=500, detail=str(e))

# ----------------
# Role Transition Guidance Endpoint
# ----------------
@app.post("/role_transition")
async def role_transition(
    request: Request,
    authorization: str = Header(None),
):
    if not authorization:
         raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Missing authentication token."
         )
    # Extract token from Authorization header
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify Google authentication token and extract user info
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception:
         raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Invalid Google authentication token"
         )

    # Extract request body
    body = await request.json()
    current     = body.get("currentRole")
    target      = body.get("targetRole")
    resume_text = body.get("resume_text")      # ← new

    if not current or not target:
       raise HTTPException(
           status_code=status.HTTP_400_BAD_REQUEST,
           detail="Both currentRole and targetRole are required."
       )

    # Generate unique plan ID and timestamp
    plan_id = str(uuid.uuid4())
    ts = datetime.now(UTC)

    # Initial store (status=processing)
    store_role_transition(user_id, {
        "plan_id": plan_id,
        "currentRole": current,
        "targetRole": target,
        "resume_text": resume_text,            # ← store snapshot
        "status": "processing",
        "createdAt": ts,
        "updatedAt": ts
    })

    async with semaphore:
        try:
            # Generate plan asynchronously
            plan = await asyncio.get_event_loop().run_in_executor(
                None,
                role_transition_instance.generate_plan,
                user_id,
                current,
                target,
                resume_text                      # ← new
            )

            # Update plan status to completed
            users_collection.update_one(
                {"_id": user_id, "features.roleTransition.plan_id": plan_id},
                {"$set": {
                    "features.roleTransition.$.status":     "completed",
                    "features.roleTransition.$.plan":       plan,
                    "features.roleTransition.$.updatedAt":  datetime.now(UTC)
                }}
            )
            return {"plan": plan, "plan_id": plan_id}

        except Exception as e:
            # Update plan status to failed on error
            users_collection.update_one(
                {"_id": user_id, "features.roleTransition.plan_id": plan_id},
                {"$set": {
                    "features.roleTransition.$.status":    "failed",
                    "features.roleTransition.$.error":     str(e),
                    "features.roleTransition.$.updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )

# ----------------
# Skill Benchmark & Gap Analysis Endpoint
# ----------------

@app.post("/skill_benchmark")
async def skill_benchmark(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    # Extract the token from the authorization header
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify the token and extract the user ID
        user = verify_google_token(token)
        user_id = user["sub"]
    except:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    # Extract the request body
    body = await request.json()
    # Extract the resume text, domain, and target role level from the request body
    resume_text       = body.get("resume_text")
    domain            = body.get("domain")
    target_role_level = body.get("target_role_level")
    # Check if the required fields are present in the request body
    if not resume_text or not domain or not target_role_level:
        raise HTTPException(
            status_code=400,
            detail="`resume_text`, `domain`, and `target_role_level` are all required."
        )

    # Generate a unique entry ID and a timestamp
    entry_id  = str(uuid.uuid4())
    timestamp = datetime.now(UTC)

    # Store the skill benchmarking request in the database
    store_skill_benchmark(user_id, {
        "entry_id": entry_id,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "resume_snapshot": resume_text[:1000] + "..." if len(resume_text) > 1000 else resume_text,
        "domain": domain,
        "target_role_level": target_role_level
    })

    # Execute the skill benchmarking asynchronously
    async with semaphore:
        try:
            loop = asyncio.get_event_loop()

            # run the benchmark and capture its output
            skill_data = await loop.run_in_executor(
                None,
                skill_benchmark_instance.run,
                user_id, entry_id, resume_text, domain, target_role_level
            )

            # return the ID plus all of the Gemini-generated fields
            return {
                "skill_benchmark_id": entry_id,
                **skill_data
            }

        except Exception as e:
            # Handle the case where the skill benchmarking fails
            logger.error("skill_benchmark failed", exc_info=e)
            users_collection.update_one(
                {"_id": user_id, "features.skillBenchmark.entry_id": entry_id},
                {"$set": {
                    "features.skillBenchmark.$.status":    "failed",
                    "features.skillBenchmark.$.error":     str(e),
                    "features.skillBenchmark.$.updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(status_code=500, detail=str(e))

# ----------------
# Resume File Extraction Endpoint
# ----------------
@app.post("/extract_resume_text")
async def extract_resume_text(
    resume: UploadFile = File(...),
    authorization: str = Header(None)
):
    # Check if authorization token is present
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify the token and extract user information
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception:
        logger.warning("Invalid auth token on extract_resume_text")
        raise HTTPException(status_code=401, detail="Invalid authentication token")
    
    # Validate file type
    valid_types = [
        "application/pdf", 
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    if resume.content_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF or Word document."
        )
    
    try:
        # Extract text from the resume file
        logger.info(f"[{user_id}] Extracting text from resume: {resume.filename}")
        result = await resume_extractor.extract_text(resume)
        
        # Return the extracted text and metadata
        return {
            "text": result["text"],
            "metadata": result["metadata"],
            "format_details": result["metadata"]["formatting"]  # Include formatting details
        }
        
    except Exception as e:
        logger.exception(f"[{user_id}] Resume extraction failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text from resume: {str(e)}"
        )


if __name__ == "__main__":
    # Retrieve the port number from environment variables, default to 8000 if not set
    port = int(os.environ.get("PORT", 8000))
    # Start the uvicorn server with the app, listening on all available network interfaces on the specified port
    uvicorn.run("main:app", host="0.0.0.0", port=port)