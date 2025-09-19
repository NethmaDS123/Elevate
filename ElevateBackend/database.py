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

# Cover Letter Storage
def store_cover_letter(user_id: str, data: dict):
    """Store a saved cover letter for a user"""
    store_user_feature(user_id, "savedCoverLetters", data)

def fetch_saved_cover_letters(user_id: str):
    """Fetch all saved cover letters for a user"""
    if DEVELOPMENT_MODE:
        logger.info(f"Development mode: returning mock saved cover letters for user {user_id}")
        return []
    
    try:
        user_doc = users_collection.find_one({"_id": user_id}, {"features.savedCoverLetters": 1})
        if user_doc and "features" in user_doc and "savedCoverLetters" in user_doc["features"]:
            # Sort by creation date, newest first
            cover_letters = user_doc["features"]["savedCoverLetters"]
            # Convert datetime objects to ISO format strings for JSON serialization
            for letter in cover_letters:
                if "createdAt" in letter and isinstance(letter["createdAt"], datetime):
                    letter["createdAt"] = letter["createdAt"].isoformat()
                if "updatedAt" in letter and isinstance(letter["updatedAt"], datetime):
                    letter["updatedAt"] = letter["updatedAt"].isoformat()
            return sorted(cover_letters, key=lambda x: x.get("createdAt", ""), reverse=True)
        return []
    except Exception as e:
        logger.error(f"Error fetching saved cover letters for user {user_id}: {str(e)}")
        return []

def delete_cover_letter(user_id: str, cover_letter_id: str):
    """Delete a specific saved cover letter"""
    if DEVELOPMENT_MODE:
        logger.info(f"Development mode: mock deleting cover letter {cover_letter_id} for user {user_id}")
        return True
    
    try:
        result = users_collection.update_one(
            {"_id": user_id},
            {"$pull": {"features.savedCoverLetters": {"cover_letter_id": cover_letter_id}}}
        )
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"Error deleting cover letter {cover_letter_id} for user {user_id}: {str(e)}")
        return False

# Saved Learning Pathways
def save_learning_pathway(user_id: str, data: dict):
    """Save a learning pathway for persistent tracking"""
    store_user_feature(user_id, "savedLearningPathways", data)

def fetch_saved_learning_pathways(user_id: str):
    """Fetch all saved learning pathways for a user"""
    if DEVELOPMENT_MODE:
        logger.info(f"Development mode: returning mock saved learning pathways for user {user_id}")
        return []
    
    try:
        user_doc = users_collection.find_one({"_id": user_id}, {"features.savedLearningPathways": 1})
        if user_doc and "features" in user_doc and "savedLearningPathways" in user_doc["features"]:
            pathways = user_doc["features"]["savedLearningPathways"]
            # Convert datetime objects to ISO format strings for JSON serialization
            for pathway in pathways:
                def convert_datetime_to_iso(obj):
                    """Recursively convert datetime objects to ISO format strings"""
                    if isinstance(obj, datetime):
                        return obj.isoformat()
                    elif isinstance(obj, dict):
                        return {k: convert_datetime_to_iso(v) for k, v in obj.items()}
                    elif isinstance(obj, list):
                        return [convert_datetime_to_iso(item) for item in obj]
                    else:
                        return obj
                
                # Convert all datetime objects in the pathway
                for key, value in pathway.items():
                    pathway[key] = convert_datetime_to_iso(value)
            return sorted(pathways, key=lambda x: x.get("createdAt", ""), reverse=True)
        return []
    except Exception as e:
        logger.error(f"Error fetching saved learning pathways for user {user_id}: {str(e)}")
        return []

def update_pathway_progress(user_id: str, pathway_id: str, progress_data: dict):
    """Update progress for a specific saved learning pathway"""
    if DEVELOPMENT_MODE:
        logger.info(f"Development mode: updating progress for pathway {pathway_id} for user {user_id}")
        return True
    
    try:
        progress_data["updatedAt"] = datetime.utcnow()
        result = users_collection.update_one(
            {"_id": user_id, "features.savedLearningPathways.pathway_id": pathway_id},
            {"$set": {"features.savedLearningPathways.$.progress": progress_data}}
        )
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"Error updating pathway progress for user {user_id}: {str(e)}")
        return False

def delete_saved_pathway(user_id: str, pathway_id: str):
    """Delete a specific saved learning pathway"""
    if DEVELOPMENT_MODE:
        logger.info(f"Development mode: mock deleting pathway {pathway_id} for user {user_id}")
        return True
    
    try:
        result = users_collection.update_one(
            {"_id": user_id},
            {"$pull": {"features.savedLearningPathways": {"pathway_id": pathway_id}}}
        )
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"Error deleting saved pathway {pathway_id} for user {user_id}: {str(e)}")
        return False
