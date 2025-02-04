import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables from .env file and configure Gemini API key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("GEMINI_API_KEY not found in environment variables!")

class ResumeOptimizer:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name

    def optimize(self, resume_text: str, job_description: str) -> dict:
        prompt = f"""
You are an expert resume optimizer specialized in ATS compliance and job-specific keyword integration for Software engineers.
Given the user's original resume and the job description below, optimize the resume by:
1. Use the best structure if original structure is not good.
2. Enhancing the formatting for clarity.
3. Integrating job-specific keywords from the job description.
4. ATS formatting.
5. No summaries on resume.
6. Provide proper well thought resume score.
If no improvements are needed, simply return the original resume.
Give feedback on where and what the user can change manually to better fit the job description.

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
            return {"optimized_resume": optimized_resume}
        except Exception as e:
            raise RuntimeError(f"Error during resume optimization: {e}")
