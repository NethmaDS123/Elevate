from fastapi import FastAPI, Request
from features.project_evaluation import ProjectEvaluator
from features.learning_paths import LearningPathways
from features.resume_optimization import ResumeOptimizer
import asyncio
import pprint
from database import (
    store_optimization_results,
    fetch_optimization_results,
    store_evaluation_result,
    store_learning_pathway_result
)
import uuid  # For generating unique user IDs
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uvicorn

app = FastAPI()

@app.get("/")
@app.head("/")  # This handles HEAD requests as well
def read_root():
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    # Fetch Render's assigned port from environment variables
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini-based Project Evaluator
project_evaluator = ProjectEvaluator()

# Initialize Gemini-based Resume Optimizer
resume_optimizer = ResumeOptimizer()

# Initialize Learning Pathways instance (using Gemini API)
learning_pathways_instance = LearningPathways()

# Limit concurrent tasks
MAX_CONCURRENT_TASKS = 5
semaphore = asyncio.Semaphore(MAX_CONCURRENT_TASKS)

# Project Evaluation Endpoint
@app.post("/evaluate_project")
async def evaluate_project(request: Request):
    """
    Endpoint to evaluate a software engineering project.
    Request Body:
      - project_description (str): The description of the project.
    Response:
      - dict: Evaluation result.
    """
    body = await request.json()
    project_description = body.get("project_description")

    if not project_description:
        return {"error": "Project description is required."}

    async with semaphore:
        evaluation = await asyncio.get_event_loop().run_in_executor(
            None, project_evaluator.evaluate, project_description
        )

    print("\n--- Project Evaluation Output ---")
    pprint.pprint(evaluation)
    print("--- End of Output ---\n")

    store_evaluation_result({
        "project_description": project_description,
        "evaluation": evaluation,
    })

    return {"evaluation": evaluation}

class OptimizationResult(BaseModel):
    user_id: str
    resume_text: str
    job_description: str
    optimized_resume: str
    token_usage: dict

# Resume Optimization Endpoint using Gemini API
@app.post("/optimize_resume")
async def optimize_resume(request: Request):
    body = await request.json()
    resume_text = body.get("resume_text")
    job_description = body.get("job_description")

    if not resume_text or not job_description:
        return {"error": "Both resume_text and job_description are required."}

    async with semaphore:
        result = await asyncio.get_event_loop().run_in_executor(
            None, resume_optimizer.optimize, resume_text, job_description
        )

    # Extract optimized resume text
    optimized_text = result.get("optimized_resume", "ERROR: No response from Gemini API.")

    # Generate a unique user ID and store result in MongoDB
    user_id = str(uuid.uuid4())
    record_id = store_optimization_results({
        "user_id": user_id,
        "resume_text": resume_text,
        "job_description": job_description,
        "optimized_resume": optimized_text,
        "token_usage": {}  # Gemini API does not provide token usage info like OpenAI
    })

    return {
        "optimized_resume": optimized_text,
        "record_id": str(record_id),
        "user_id": user_id
    }

# Learning Pathways Endpoint
@app.post("/learning_pathways")
async def get_learning_pathways(request: Request):
    """
    Endpoint to generate a guided learning pathway for a given topic.
    Request Body (JSON):
    {
        "topic": "cloud computing"
    }
    Response (JSON):
    {
        "learning_pathway": "Learning Pathway for cloud computing: ..."
    }
    """
    body = await request.json()
    topic = body.get("topic")
    if not topic:
        return {"error": "Topic is required."}

    async with semaphore:
        pathway = await asyncio.get_event_loop().run_in_executor(
            None, learning_pathways_instance.generate_pathway, topic
        )

    if "learning_pathway" in pathway:
        store_learning_pathway_result({
            "topic": topic,
            "learning_pathway": pathway["learning_pathway"]
        })

    return pathway
