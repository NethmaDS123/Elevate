from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime
import uuid
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("database")

# Load environment variables
load_dotenv()

# MongoDB URI from .env
MONGO_URI = os.getenv("MONGODB_URI")
DEVELOPMENT_MODE = False

# Check if we're in development mode with a dummy URI
if not MONGO_URI or MONGO_URI == "mongodb://localhost:27017/elevate":
    logger.warning("Using development mode for database operations")
    DEVELOPMENT_MODE = True
    # Set a placeholder URI for development
    MONGO_URI = "mongodb://localhost:27017/elevate"

# Connect to MongoDB and use the "users" collection
try:
    client = MongoClient(MONGO_URI)
    db = client["elevate_db"]
    users_collection = db["users"]
    # Test the connection
    if not DEVELOPMENT_MODE:
        client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    logger.warning("Falling back to development mode")
    DEVELOPMENT_MODE = True
    # Create a mock users_collection for development
    class MockCollection:
        def __init__(self):
            self.data = {}
        
        def update_one(self, filter, update, upsert=False):
            user_id = filter.get("_id")
            if not user_id:
                return
            if user_id not in self.data and upsert:
                self.data[user_id] = {"_id": user_id, "features": {}}
            # Development mode - just log the operation
            logger.info(f"DEV MODE: update_one for user {user_id}")
            return True
        
        def find_one(self, filter, projection=None):
            user_id = filter.get("_id")
            if not user_id or user_id not in self.data:
                return None
            # Development mode - return mock data
            return self.data.get(user_id)
    
    users_collection = MockCollection()

def store_user_feature(user_id: str, feature: str, data: dict):
    """Push a new entry into features.<feature> array within the user document."""
    # Ensure each entry has a unique entry_id + timestamps
    if "entry_id" not in data:
        data["entry_id"] = str(uuid.uuid4())
    now = datetime.utcnow()
    data.setdefault("createdAt", now)
    data.setdefault("updatedAt", now)

    if DEVELOPMENT_MODE:
        logger.info(f"DEV MODE: Storing {feature} data for user {user_id}")
        return

    update = {
        "$push": {f"features.{feature}": data},
        "$set": {"updatedAt": now}
    }
    users_collection.update_one({"_id": user_id}, update, upsert=True)

def fetch_latest_feature(user_id: str, feature: str):
    """Retrieve the most recent entry for the given feature in a user's document"""
    
    if DEVELOPMENT_MODE:
        logger.info(f"DEV MODE: Fetching latest {feature} for user {user_id}")
        return None

    user = users_collection.find_one({"_id": user_id}, {f"features.{feature}": 1})
    if not user or "features" not in user or feature not in user["features"]:
        return None

    entries = user["features"][feature]
    # sorted by createdAt/updatedAt descending
    entries.sort(key=lambda e: e.get("updatedAt", e.get("createdAt", datetime.utcnow())), reverse=True)
    return entries[0] if entries else None

def update_feature_entry(user_id: str, feature: str, entry_id: str, update_data: dict):
    """Update specific fields on one feature entry by its entry_id."""
    update_data["updatedAt"] = datetime.utcnow()
    
    if DEVELOPMENT_MODE:
        logger.info(f"DEV MODE: Updating {feature} entry {entry_id} for user {user_id}")
        return

    users_collection.update_one(
        {"_id": user_id, f"features.{feature}.entry_id": entry_id},
        {"$set": {f"features.{feature}.$.{k}": v for k, v in update_data.items()}}
    )


# Resume Optimization 
def store_optimization_results(user_id: str, data: dict):
    store_user_feature(user_id, "resumeOptimizer", data)

def fetch_optimization_results(user_id: str):
    return fetch_latest_feature(user_id, "resumeOptimizer")


# Project Evaluation 
def store_evaluation_result(user_id: str, data: dict):
    store_user_feature(user_id, "projectEvaluation", data)

def fetch_evaluation_results(user_id: str):
    return fetch_latest_feature(user_id, "projectEvaluation")


# Learning Pathways 
def store_learning_pathway_result(user_id: str, data: dict):
    store_user_feature(user_id, "learningPathways", data)

def fetch_learning_pathway_results(user_id: str):
    return fetch_latest_feature(user_id, "learningPathways")


# Interview Analysis
def store_interview_analysis(user_id: str, data: dict):
    store_user_feature(user_id, "interviewAnalysis", data)

def fetch_interview_analysis(user_id: str):
    return fetch_latest_feature(user_id, "interviewAnalysis")


# Interview Feedback 
def store_interview_feedback(user_id: str, data: dict):
    store_user_feature(user_id, "interviewFeedback", data)

def fetch_interview_feedback(user_id: str):
    return fetch_latest_feature(user_id, "interviewFeedback")


# Role Transition Guidance 
def store_role_transition(user_id: str, data: dict):
    store_user_feature(user_id, "roleTransition", data)

def fetch_role_transition(user_id: str):
    return fetch_latest_feature(user_id, "roleTransition")

# Skill Benchmarking
def store_skill_benchmark(user_id: str, data: dict):
    store_user_feature(user_id, "skillBenchmark", data)

def fetch_skill_benchmark(user_id: str):
    return fetch_latest_feature(user_id, "skillBenchmark")
