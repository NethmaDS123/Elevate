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
    """Push a new entry into features.<feature> array within the user document."""
    # Ensure each entry has a unique entry_id + timestamps
    if "entry_id" not in data:
        data["entry_id"] = str(uuid.uuid4())
    now = datetime.utcnow()
    data.setdefault("createdAt", now)
    data.setdefault("updatedAt", now)

    update = {
        "$push": {f"features.{feature}": data},
        "$set": {"updatedAt": now}
    }
    users_collection.update_one({"_id": user_id}, update, upsert=True)

def fetch_latest_feature(user_id: str, feature: str):
    """
    Retrieve the most recent entry for the given feature in a user's document,
    ordered by the entry's timestamp (createdAt or provided timestamp).
    """
    user = users_collection.find_one({"_id": user_id}, {f"features.{feature}": 1})
    if not user or "features" not in user or feature not in user["features"]:
        return None

    entries = user["features"][feature]
    # sort by createdAt/updatedAt descending
    entries.sort(key=lambda e: e.get("updatedAt", e.get("createdAt", datetime.utcnow())), reverse=True)
    return entries[0] if entries else None

def update_feature_entry(user_id: str, feature: str, entry_id: str, update_data: dict):
    """Update specific fields on one feature entry by its entry_id."""
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


# Role Transition Guidance (Feature Name: "roleTransition")
def store_role_transition(user_id: str, data: dict):
    store_user_feature(user_id, "roleTransition", data)

def fetch_role_transition(user_id: str):
    return fetch_latest_feature(user_id, "roleTransition")

# Skill Benchmarking (Feature Name: "skillBenchmark")
def store_skill_benchmark(user_id: str, data: dict):
    store_user_feature(user_id, "skillBenchmark", data)

def fetch_skill_benchmark(user_id: str):
    return fetch_latest_feature(user_id, "skillBenchmark")
