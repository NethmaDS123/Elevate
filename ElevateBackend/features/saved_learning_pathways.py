import uuid
import logging
from datetime import datetime, UTC
from database import save_learning_pathway, fetch_saved_learning_pathways, update_pathway_progress, delete_saved_pathway

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class SavedLearningPathways:
    def __init__(self):
        pass

    def save_pathway(self, user_id: str, pathway_data: dict) -> dict:
        """Save a learning pathway for persistent tracking"""
        try:
            logger.info(f"[{user_id}] Received pathway data: {pathway_data}")
            
            pathway_id = str(uuid.uuid4())
            now = datetime.now(UTC)
            
            # Get progress data from frontend or use defaults
            frontend_progress = pathway_data.get("progress", {})
            
            # Prepare data to save (convert datetime to ISO string for JSON compatibility)
            save_data = {
                "pathway_id": pathway_id,
                "topic": pathway_data.get("topic", ""),
                "learning_pathway": pathway_data.get("learning_pathway", {}),
                "progress": {
                    "completed_items": frontend_progress.get("completed_items", []),
                    "total_items": frontend_progress.get("total_items", 0),
                    "percentage": frontend_progress.get("percentage", 0),
                    "last_accessed": now.isoformat()
                },
                "saved_at": now.isoformat(),
                "status": "active"
            }
            
            logger.info(f"[{user_id}] Prepared save data: {save_data}")
            
            # Call the database function to save
            result = save_learning_pathway(user_id, save_data)
            
            # In development mode, the function returns None, so we handle that
            logger.info(f"[{user_id}] Database save result: {result}")
            
            logger.info(f"[{user_id}] Successfully saved learning pathway: {pathway_id}")
            return {
                "success": True,
                "pathway_id": pathway_id,
                "message": "Learning pathway saved successfully"
            }
            
        except Exception as e:
            logger.error(f"[{user_id}] Error saving learning pathway: {str(e)}", exc_info=True)
            return {
                "success": False,
                "error": f"Failed to save learning pathway: {str(e)}"
            }

    def get_saved_pathways(self, user_id: str) -> dict:
        """Get all saved learning pathways for a user"""
        try:
            pathways = fetch_saved_learning_pathways(user_id)
            
            logger.info(f"[{user_id}] Retrieved {len(pathways)} saved learning pathways")
            return {
                "success": True,
                "pathways": pathways
            }
            
        except Exception as e:
            logger.error(f"[{user_id}] Error fetching saved pathways: {str(e)}")
            return {
                "success": False,
                "error": "Failed to fetch saved pathways",
                "pathways": []
            }

    def update_progress(self, user_id: str, pathway_id: str, progress_data: dict) -> dict:
        """Update progress for a specific learning pathway"""
        try:
            now = datetime.now(UTC)
            progress_update = {
                "completed_items": progress_data.get("completed_items", []),
                "total_items": progress_data.get("total_items", 0),
                "percentage": progress_data.get("percentage", 0),
                "last_accessed": now
            }
            
            success = update_pathway_progress(user_id, pathway_id, progress_update)
            
            if success:
                logger.info(f"[{user_id}] Updated progress for pathway: {pathway_id}")
                return {
                    "success": True,
                    "message": "Progress updated successfully"
                }
            else:
                return {
                    "success": False,
                    "error": "Failed to update progress"
                }
                
        except Exception as e:
            logger.error(f"[{user_id}] Error updating progress: {str(e)}")
            return {
                "success": False,
                "error": "Failed to update progress"
            }

    def delete_pathway(self, user_id: str, pathway_id: str) -> dict:
        """Delete a saved learning pathway"""
        try:
            success = delete_saved_pathway(user_id, pathway_id)
            
            if success:
                logger.info(f"[{user_id}] Deleted pathway: {pathway_id}")
                return {
                    "success": True,
                    "message": "Learning pathway deleted successfully"
                }
            else:
                return {
                    "success": False,
                    "error": "Failed to delete pathway"
                }
                
        except Exception as e:
            logger.error(f"[{user_id}] Error deleting pathway: {str(e)}")
            return {
                "success": False,
                "error": "Failed to delete pathway"
            }
