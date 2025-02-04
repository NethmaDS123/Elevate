from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

# MongoDB URI from .env
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise ValueError("MONGODB_URI not found in environment variables!")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["elevate_db"]  # Database name

# Resume Optimization
def store_optimization_results(data):
    collection = db["resume_optimizations"]
    stored_data = {
        "user_id": data["user_id"],
        "resume_text": data["resume_text"],  # Store original resume
        "job_description": data["job_description"],
        "optimized_resume": data["optimized_resume"].strip(),  # Store only optimized text
        "token_usage": data.get("token_usage", {})
    }
    result = collection.insert_one(stored_data)
    return result.inserted_id

def fetch_optimization_results(user_id):
    results = db["resume_optimizations"].find({"user_id": user_id})
    return list(results)

# Project Evaluation
def store_evaluation_result(data):
    collection = db["project_evaluations"]
    stored_data = {
        "project_description": data["project_description"],
        "evaluation": data["evaluation"],
        "timestamp": datetime.utcnow()
    }
    result = collection.insert_one(stored_data)
    return result.inserted_id

def fetch_evaluation_results():
    collection = db["project_evaluations"]
    results = collection.find().sort("timestamp", -1)
    return list(results)

# Learning Pathways
def store_learning_pathway_result(data):
    collection = db["learning_pathways"]
    stored_data = {
        "topic": data["topic"],
        "learning_pathway": data["learning_pathway"],
        "timestamp": datetime.utcnow()
    }
    result = collection.insert_one(stored_data)
    return result.inserted_id

def fetch_learning_pathway_results():
    collection = db["learning_pathways"]
    results = collection.find().sort("timestamp", -1)
    return list(results)
