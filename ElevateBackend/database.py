from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

# MongoDB URI from .env
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise ValueError("MONGODB_URI not found in environment variables!")

# Connect to MongoDB and use the "users" collection
client = MongoClient(MONGO_URI)
db = client["elevate_db"]
users_collection = db["users"]

def store_user_feature(user_id: str, feature: str, data: dict):
    """Push data with required fields"""
    if "entry_id" not in data:
        data["entry_id"] = str(uuid.uuid4())
    if "createdAt" not in data:
        data["createdAt"] = datetime.utcnow()
    if "updatedAt" not in data:
        data["updatedAt"] = datetime.utcnow()
        
    update = {
        "$push": {f"features.{feature}": data},
        "$set": {"updatedAt": datetime.utcnow()}
    }
    users_collection.update_one({"_id": user_id}, update, upsert=True)

def fetch_latest_feature(user_id: str, feature: str):
    """
    Retrieve the latest entry for the given feature in a user's document,
    based on descending timestamp.
    """
    user = users_collection.find_one({"_id": user_id}, {f"features.{feature}": 1})
    if user and "features" in user and feature in user["features"]:
        results = sorted(
            user["features"][feature],
            key=lambda x: x.get("timestamp", datetime.utcnow()),
            reverse=True
        )
        return results[0] if results else None
    return None

def update_feature_entry(user_id: str, feature: str, entry_id: str, update_data: dict):
    """Update a specific feature entry"""
    update_data["updatedAt"] = datetime.utcnow()
    users_collection.update_one(
        {"_id": user_id, f"features.{feature}.entry_id": entry_id},
        {"$set": {f"features.{feature}.$.{k}": v for k, v in update_data.items()}}
    )



# Resume Optimization (Feature Name: "resumeOptimizer")
def store_optimization_results(user_id: str, data: dict):
    store_user_feature(user_id, "resumeOptimizer", data)

def fetch_optimization_results(user_id: str):
    return fetch_latest_feature(user_id, "resumeOptimizer")

# Project Evaluation (Feature Name: "projectEvaluation")
def store_evaluation_result(user_id: str, data: dict):
    store_user_feature(user_id, "projectEvaluation", data)

def fetch_evaluation_results(user_id: str):
    return fetch_latest_feature(user_id, "projectEvaluation")

# Learning Pathways (Feature Name: "learningPathways")
def store_learning_pathway_result(user_id: str, data: dict):
    store_user_feature(user_id, "learningPathways", data)

def fetch_learning_pathway_results(user_id: str):
    return fetch_latest_feature(user_id, "learningPathways")

# Interview Analysis (Feature Name: "interviewAnalysis")
def store_interview_analysis(user_id: str, data: dict):
    store_user_feature(user_id, "interviewAnalysis", data)

def fetch_interview_analysis(user_id: str):
    return fetch_latest_feature(user_id, "interviewAnalysis")

# Interview Feedback (Feature Name: "interviewFeedback")
def store_interview_feedback(user_id: str, data: dict):
    store_user_feature(user_id, "interviewFeedback", data)

def fetch_interview_feedback(user_id: str):
    return fetch_latest_feature(user_id, "interviewFeedback")
