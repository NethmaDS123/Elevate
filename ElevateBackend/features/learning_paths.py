import openai
from dotenv import load_dotenv
import os

# Load environment variables from .env file and configure OpenAI API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables!")

class LearningPathways:
    def __init__(self, model: str = "gpt-4"):
        self.model = model

    def generate_pathway(self, topic: str) -> dict:
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
        try:
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
            return {"learning_pathway": pathway_text}
        except Exception as e:
            return {"error": f"Error generating learning pathway: {str(e)}"}
# Example usage
if __name__ == "__main__":
    lp = LearningPathways()
    pathway = lp.generate_pathway("Machine Learning")
    if "learning_pathway" in pathway:
        print(pathway["learning_pathway"])
    else:
        print(pathway["error"])