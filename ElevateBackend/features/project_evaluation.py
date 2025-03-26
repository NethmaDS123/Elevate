import google.generativeai as genai
from dotenv import load_dotenv
import os
import textwrap

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ProjectEvaluator:
    """A class to evaluate software engineering projects using Gemini AI."""

    def __init__(self, model_name="gemini-1.5-flash"):
        self.model_name = model_name

    def evaluate(self, project_description: str) -> dict:
        """
        Evaluate a project description using Gemini API.

        Args:
        - project_description (str): The description of the project.

        Returns:
        - dict: Evaluation result including score, strengths, and suggestions.
        """
        try:
            # Initialize the model
            model = genai.GenerativeModel(self.model_name)

            # Create a well-formatted prompt using textwrap.dedent()
            prompt = textwrap.dedent(f"""
                You are an expert software engineering evaluator with deep knowledge of software development, AI, and industry best practices. Your task is to thoroughly analyze the given project description and provide a structured, detailed evaluation.

                ## Evaluation Criteria:
                1. **Innovation (0-30 points)**  
                   - How unique or groundbreaking is the idea?  
                   - Does it solve a real-world problem in a novel way?  

                2. **Technical Complexity (0-30 points)**  
                   - How challenging is the implementation?  
                   - Does it involve advanced concepts like AI, distributed systems, or optimization?  

                3. **Completeness & Feasibility (0-20 points)**  
                   - Is the project well-defined and executable with current technology?  
                   - Are the key components, architecture, and implementation details addressed?  

                4. **Scalability & Maintainability (0-10 points)**  
                   - Can the project handle increasing users and data?  
                   - Is the codebase structured for long-term maintainability?  

                5. **Industry Relevance (0-10 points)**  
                   - Does the project align with industry needs and trends?  
                   - Would companies or developers find it useful?  

                ## Expected Response Format:
                **Overall Score: [0-100]**  

                **Detailed Feedback:**  
                - **Innovation:** [Analysis]  
                - **Technical Complexity:** [Analysis]  
                - **Completeness & Feasibility:** [Analysis]  
                - **Scalability & Maintainability:** [Analysis]  
                - **Industry Relevance:** [Analysis]  

                **Strengths:**  
                [List of strong aspects]  

                **Areas for Improvement:**  
                [List of specific, actionable recommendations for enhancement]  

                ## Project Description:  
                {project_description}
            """)

            # Generate a response from Gemini
            response = model.generate_content(prompt)

            # Extract and clean response text
            evaluation = response.text.strip() if response and response.text else "No response received."

            return {"evaluation": evaluation}

        except genai.GenerationError as e:
            raise RuntimeError(f"Gemini API Error: {e}")

        except Exception as e:
            raise RuntimeError(f"Unexpected error during project evaluation: {e}")
