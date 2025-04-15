import google.generativeai as genai
from dotenv import load_dotenv
import os
from datetime import datetime, UTC
from database import store_optimization_results

# Load environment variables and configure Gemini API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables!")

genai.configure(api_key=GEMINI_API_KEY)

class ResumeOptimizer:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name

    def optimize(self, user_id: str, resume_text: str, job_description: str) -> dict:
        prompt = f"""
You are an expert resume optimizer specialized in ATS compliance and job-specific keyword integration for software engineers.
Given the user's original resume and the job description below, optimize the resume by:
1. Using the best structure if the original structure is suboptimal.
2. Enhancing formatting for clarity.
3. Integrating job-specific keywords from the job description.
4. Ensuring ATS-friendly formatting.
5. Omitting any summaries on the resume.
6. Providing a well-thought-out resume score.
If no improvements are needed, simply return the original resume.
Additionally, provide concise feedback on areas the user can manually adjust to better fit the job description.

Original Resume:
{resume_text}

Job Description:
{job_description}

Optimized Resume:
"""
        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(prompt)
            optimized_resume = response.text.strip()

            store_optimization_results(user_id, {
                "resume_text": resume_text,
                "job_description": job_description,
                "optimized_resume": optimized_resume,
                "token_usage": {},  # Gemini doesn't provide detailed token usage.
                "timestamp": datetime.now(UTC)
            })

            return {"optimized_resume": optimized_resume}

        except Exception as e:
            raise RuntimeError(f"Error during resume optimization: {e}")
