import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class ProjectEvaluator:
    """A class to evaluate software engineering projects."""

    def __init__(self, model_name="gemini-1.5-flash"):
        self.model_name = model_name

    def evaluate(self, project_description: str) -> dict:
        """
        Evaluate a project description using Gemini API.

        Args:
        - project_description (str): The description of the project.

        Returns:
        - dict: Evaluation result including score, suggestions, and strengths.
        """
        try:
            # Initialize the model
            model = genai.GenerativeModel(self.model_name)

            # Create the prompt for Gemini
            prompt = f"""
            You are an expert project evaluator. Analyze the given project description and provide:
            1. A score out of 100 based on innovation, complexity, and completeness.
            2. Suggestions for improvement or additional features if needed.
            3. Strengths of the project if it already meets industry standards.

            Project Description:
            {project_description}

            Evaluation Output Format:
            Score: [0-100]
            Suggestions: [List of actionable suggestions or "None"]
            Strengths: [List of strengths or "None"]
            """

            # Use the model to generate a response
            response = model.generate_content(prompt)
            evaluation = response.text.strip()

            return {"evaluation": evaluation}

        except Exception as e:
            raise RuntimeError(f"Error during project evaluation: {e}")
