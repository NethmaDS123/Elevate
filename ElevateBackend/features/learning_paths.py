import openai
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime, UTC
from database import store_learning_pathway_result

# Load environment variables and configure OpenAI API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables!")

class LearningPathways:
    def __init__(self, model: str = "gpt-3.5-turbo"):
        self.model = model

    def generate_pathway(self, user_id: str, topic: str) -> dict:
        pathway_id = str(uuid.uuid4())
        timestamp = datetime.now(UTC)
        
        try:
            # Store initial processing state
            store_learning_pathway_result(user_id, {
                "pathway_id": pathway_id,
                "topic": topic,
                "status": "processing",
                "createdAt": timestamp,
                "updatedAt": timestamp
            })

            # Generate pathway content
            prompt = f"""You are an expert curriculum designer creating detailed learning pathways. For '{topic}', generate:

                  1. A hierarchical breakdown of the subject into modules and subtopics
                  2. 6-8 core modules with clear progression
                  3. Each module should contain:
                    - 4-8 key topics
                    - Subtopic breakdowns for complex concepts
                    - Practical applications where relevant

                  Format strictly as:

                  Learning Pathway for {topic}:
                  Module 1: [Module Title]
                    - [Main Topic 1]
                      * [Subtopic 1.1]
                      * [Subtopic 1.2]
                    - [Main Topic 2]
                      * [Subtopic 2.1]
                  Module 2: [Module Title]
                    - [Main Topic 1]
                      * [Subtopic 1.1]
                      * [Subtopic 1.2]

                  Example for "Data Structures":
                  Module 1: Fundamental Data Structures
                    - Arrays
                      * Memory allocation
                      * Time complexity analysis
                      * Multi-dimensional arrays
                    - Linked Lists
                      * Singly vs doubly linked
                      * Pointer manipulation
                      * Real-world applications

                  Focus on technical depth and logical progression. Avoid introductory fluff."""
            response = openai.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a technical curriculum architect."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
                max_tokens=1500,
            )
            
            pathway_text = response.choices[0].message.content.strip()
            
            # Update with successful result
            store_learning_pathway_result(user_id, {
                "pathway_id": pathway_id,
                "status": "completed",
                "learning_pathway": pathway_text,
                "updatedAt": datetime.now(UTC)
            })

            return {
                "pathway_id": pathway_id,
                "learning_pathway": pathway_text,
                "status": "completed"
            }

        except Exception as e:
            error_data = {
                "pathway_id": pathway_id,
                "status": "failed",
                "error": f"Pathway generation failed: {str(e)}",
                "updatedAt": datetime.now(UTC)
            }
            store_learning_pathway_result(user_id, error_data)
            return error_data