# main.py
import os
import uuid
import asyncio
import logging
from datetime import datetime, UTC

from fastapi import FastAPI, Request, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json 

from features.project_evaluation import ProjectEvaluator
from features.learning_paths import LearningPathways
from features.resume_optimization import ResumeOptimizer 
from features.interview_preparation import InterviewPreparation
from features.role_transition import RoleTransition 
from features.skill_benchmark import SkillBenchmark
from database import (
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

MAX_CONCURRENT_TASKS = 5
semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)

# ----------------
# Project Evaluation Endpoint
# ----------------

@app.post("/evaluate_project")
async def evaluate_project(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception as e:
        logger.warning(f"[unauthenticated] evaluate_project blocked: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    body = await request.json()
    project_description = body.get("project_description")
    if not project_description:
        raise HTTPException(status_code=400, detail="Project description is required.")

    evaluation_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)

    # Create initial "processing" entry
    store_evaluation_result(user_id, {
        "evaluation_id": evaluation_id,
        "project_description": project_description,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp
    })

    async with semaphore:
        try:
            logger.info(f"[{user_id}] Starting project evaluation (id={evaluation_id})")

            # Run the evaluator (returns a structured dict now)
            evaluation: dict = await asyncio.get_event_loop().run_in_executor(
                None,
                project_evaluator.evaluate,
                user_id,
                project_description
            )

            logger.info(f"[{user_id}] Completed project evaluation (id={evaluation_id}) — score={evaluation.get('overall_score')}")

            # Persist the completed result into the user's feature array
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

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    
    try:
        # Authentication
        token = authorization.split("Bearer ")[-1]
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    # Input validation
    body = await request.json()
    resume_text = body.get("resume_text")
    job_description = body.get("job_description")
    if not resume_text or not job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description are required.")

    # Create tracking entry
    optimization_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)
    initial_data = {
        "optimization_id": optimization_id,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "resume_snapshot": resume_text[:1000] + "..." if len(resume_text) > 1000 else resume_text,
        "jd_snapshot": job_description[:500] + "..." if len(job_description) > 500 else job_description
    }
    store_optimization_results(user_id, initial_data)

    async with semaphore:
        try:
            # Run the optimizer
            result = await asyncio.get_event_loop().run_in_executor(
                None, resume_optimizer.optimize, user_id, resume_text, job_description
            )

            # Persist the completed result (same fields as `result`)
            users_collection.update_one(
                {"_id": user_id, "features.resumeOptimizer.optimization_id": optimization_id},
                {"$set": {
                    "status": "completed",
                    "updatedAt": datetime.now(UTC),
                    "initial_assessment": result["initial_assessment"],
                    "relevance_analysis": result["relevance_analysis"],
                    "optimized_resume": result["optimized_resume"],
                    "final_evaluation": result["final_evaluation"],
                    "career_development": result["career_development"]
                }}
            )

            # Return everything at top level
            return {
                "optimization_id": optimization_id,
                **result
            }
            
        except Exception as e:
            users_collection.update_one(
                {"_id": user_id, "features.resumeOptimizer.optimization_id": optimization_id},
                {"$set": {
                    "status": "failed",
                    "error": str(e),
                    "updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(status_code=500, detail=str(e))

# ----------------
# Learning Pathways Endpoint
# ----------------
@app.post("/learning_pathways")
async def get_learning_pathways(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception:
        logger.warning("Invalid auth token on learning_pathways")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    body = await request.json()
    topic = body.get("topic")
    if not topic:
        raise HTTPException(status_code=400, detail="`topic` is required.")

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
            # Use the existing instance, not re-instantiating
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                learning_pathways_instance.generate_pathway,
                user_id,
                topic
            )

            # Persist only the JSON payload (the 'learning_pathway' key)
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
    
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)  # This must return user info
        user_id = user_info["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    body = await request.json()
    question = body.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Question is required.")
    
    # Generate unique ID for this analysis
    analysis_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)
    
    # Create initial entry
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
            analysis = await asyncio.get_event_loop().run_in_executor(
                None, interview_preparation_instance.analyze_question, user_id, question
            )
            
            # Update existing entry
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
    
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    body = await request.json()
    question = body.get("question")
    user_answer = body.get("user_answer")
    if not question or not user_answer:
        raise HTTPException(status_code=400, detail="Both question and user_answer are required.")

    # Generate unique ID for this feedback
    feedback_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)
    
    # Create initial entry
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
            feedback = await asyncio.get_event_loop().run_in_executor(
                None, interview_preparation_instance.feedback_on_answer, user_id, question, user_answer
            )
            
            # Update existing entry
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
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authentication token.")
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google authentication token")

    body = await request.json()
    current = body.get("currentRole")
    target = body.get("targetRole")
    if not current or not target:
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Both currentRole and targetRole are required.")

    plan_id = str(uuid.uuid4())
    ts = datetime.now(UTC)
    # initial store
    store_role_transition(user_id, {
        "plan_id": plan_id,
        "currentRole": current,
        "targetRole": target,
        "status": "processing",
        "createdAt": ts,
        "updatedAt": ts
    })

    async with semaphore:
        try:
            plan = await asyncio.get_event_loop().run_in_executor(
                None,
                role_transition_instance.generate_plan, user_id, current, target
            )
            # update to completed
            users_collection.update_one(
                {"_id": user_id, "features.roleTransition.plan_id": plan_id},
                {"$set": {
                    "features.roleTransition.$.status": "completed",
                    "features.roleTransition.$.plan": plan,
                    "features.roleTransition.$.updatedAt": datetime.now(UTC)
                }}
            )
            return {"plan": plan, "plan_id": plan_id}

        except Exception as e:
            users_collection.update_one(
                {"_id": user_id, "features.roleTransition.plan_id": plan_id},
                {"$set": {
                    "features.roleTransition.$.status": "failed",
                    "features.roleTransition.$.error": str(e),
                    "features.roleTransition.$.updatedAt": datetime.now(UTC)
                }}
            )
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# ----------------
# Skill Benchmark & Gap Analysis Endpoint
# ----------------

@app.post("/skill_benchmark")
async def skill_benchmark(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    token = authorization.split("Bearer ")[-1]
    try:
        user = verify_google_token(token)
        user_id = user["sub"]
    except:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    body = await request.json()
    resume_text       = body.get("resume_text")
    domain            = body.get("domain")
    target_role_level = body.get("target_role_level")
    if not resume_text or not domain or not target_role_level:
        raise HTTPException(
            status_code=400,
            detail="`resume_text`, `domain`, and `target_role_level` are all required."
        )

    entry_id  = str(uuid.uuid4())
    timestamp = datetime.now(UTC)

    store_skill_benchmark(user_id, {
        "entry_id": entry_id,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "resume_snapshot": resume_text[:1000] + "..." if len(resume_text) > 1000 else resume_text,
        "domain": domain,
        "target_role_level": target_role_level
    })

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




if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)