from fastapi import FastAPI, Request, Header, HTTPException
from features.project_evaluation import ProjectEvaluator
from features.learning_paths import LearningPathways
from features.resume_optimization import ResumeOptimizer
from features.interview_preparation import InterviewPreparation
import asyncio
import pprint
from database import (
    store_evaluation_result,
    store_optimization_results,
    store_learning_pathway_result,
    store_interview_analysis,
    store_interview_feedback,
    users_collection 
)
from auth import verify_google_token  
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from datetime import datetime, UTC
import uuid
from fastapi.responses import JSONResponse


app = FastAPI()

@app.get("/")
@app.head("/")
def read_root():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize instances of our feature classes
project_evaluator = ProjectEvaluator()
resume_optimizer = ResumeOptimizer()
learning_pathways_instance = LearningPathways()
interview_preparation_instance = InterviewPreparation()

MAX_CONCURRENT_TASKS = 5
semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)

# ----------------
# Project Evaluation Endpoint
# ----------------
# main.py (Updated Project Evaluation Endpoint)
@app.post("/evaluate_project")
async def evaluate_project(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    
    token = authorization.split("Bearer ")[-1]
    try:
        user_info = verify_google_token(token)
        user_id = user_info["sub"]
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    body = await request.json()
    project_description = body.get("project_description")
    if not project_description:
        raise HTTPException(status_code=400, detail="Project description is required.")

    # Generate unique ID for this evaluation
    evaluation_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)
    
    # Create initial entry
    initial_data = {
        "evaluation_id": evaluation_id,
        "project_description": project_description,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp
    }
    store_evaluation_result(user_id, initial_data)

    async with semaphore:
        try:
            evaluation = await asyncio.get_event_loop().run_in_executor(
                None, project_evaluator.evaluate, user_id, project_description
            )
            
            # Update existing entry
            update_data = {
                "status": "completed",
                "evaluation": evaluation,
                "updatedAt": datetime.now(UTC)
            }
            
            users_collection.update_one(
                {"_id": user_id, "features.projectEvaluation.evaluation_id": evaluation_id},
                {"$set": {"features.projectEvaluation.$.status": "completed",
                          "features.projectEvaluation.$.evaluation": evaluation,
                          "features.projectEvaluation.$.updatedAt": datetime.now(UTC)}}
            )
            
            return {"evaluation": evaluation, "evaluation_id": evaluation_id}
            
        except Exception as e:
            users_collection.update_one(
                {"_id": user_id, "features.projectEvaluation.evaluation_id": evaluation_id},
                {"$set": {"features.projectEvaluation.$.status": "failed",
                          "features.projectEvaluation.$.error": str(e),
                          "features.projectEvaluation.$.updatedAt": datetime.now(UTC)}}
            )
            raise HTTPException(status_code=500, detail=str(e))

# Updated Resume Optimization Endpoint
@app.post("/optimize_resume")
async def optimize_resume(request: Request, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authentication token.")
    token = authorization.split("Bearer ")[-1]
    user_info = verify_google_token(token)
    user_id = user_info["sub"]

    body = await request.json()
    resume_text = body.get("resume_text")
    job_description = body.get("job_description")
    if not resume_text or not job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description are required.")

    # Generate unique ID for this optimization
    optimization_id = str(uuid.uuid4())
    timestamp = datetime.now(UTC)
    
    # Create initial entry
    initial_data = {
        "optimization_id": optimization_id,
        "resume_text": resume_text,
        "job_description": job_description,
        "status": "processing",
        "createdAt": timestamp,
        "updatedAt": timestamp
    }
    store_optimization_results(user_id, initial_data)

    async with semaphore:
        try:
            result = await asyncio.get_event_loop().run_in_executor(
                None, resume_optimizer.optimize, user_id, resume_text, job_description
            )

            optimized_text = result.get("optimized_resume", "ERROR: No response from Gemini API.")
            
            # Update existing entry
            users_collection.update_one(
                {"_id": user_id, "features.resumeOptimizer.optimization_id": optimization_id},
                {"$set": {"features.resumeOptimizer.$.status": "completed",
                          "features.resumeOptimizer.$.optimized_resume": optimized_text,
                          "features.resumeOptimizer.$.updatedAt": datetime.now(UTC)}}
            )

            return {"optimized_resume": optimized_text, "optimization_id": optimization_id}
            
        except Exception as e:
            users_collection.update_one(
                {"_id": user_id, "features.resumeOptimizer.optimization_id": optimization_id},
                {"$set": {"features.resumeOptimizer.$.status": "failed",
                          "features.resumeOptimizer.$.error": str(e),
                          "features.resumeOptimizer.$.updatedAt": datetime.now(UTC)}}
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
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token") from e

    body = await request.json()
    topic = body.get("topic")
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required.")

    async with semaphore:
        try:
            pathway = await asyncio.get_event_loop().run_in_executor(
                None, learning_pathways_instance.generate_pathway, user_id, topic
            )
            return pathway
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
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