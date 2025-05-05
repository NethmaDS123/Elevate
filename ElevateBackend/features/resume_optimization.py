# features/resume_optimization.py

"""
ResumeOptimizer:  end to end résumé enhancement using Google Gemini.
Builds a structured prompt (ATS optimised resume + analysis + score)
Sends it to Gemini
Parses / validates pure JSON response
ersists input + output to MongoDB (via store_optimization_results)
"""

import re
import time
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import logging
from datetime import datetime, UTC
from database import store_optimization_results

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("features.resume_optimization")

# Load environment and configure Gemini
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment variables!")
genai.configure(api_key=GEMINI_API_KEY)

COMPREHENSIVE_OPTIMIZER_PROMPT = """
You are an expert career coach and ATS-compliance specialist. Given the user's existing resume and the job description below:

1. **Produce an ATS-Optimized Résumé** using only content from the original:
   - Reorder sections to highlight Technologies and Projects first.
   - Rewrite bullets with strong action verbs.
   - Quantify every achievement.
   - Prioritize keywords from the job description (ReactJS, NextJS, Django/DRF, Postgres, TensorFlow).

2. **Analyze**:
   - **Strengths**: 3-5 bullet points of what already matches this JD.
   - **Weaknesses**: 3-5 bullet points of missing or weak areas.
   - **Recommendations**: For each weakness, one actionable step to close the gap.

Wrap your full output in **pure JSON** following this schema:

{{
  "optimized_resume": "<full ATS-optimized resume text>",
  "analysis": {{
    "strengths": ["..."],
    "weaknesses": ["..."],
    "recommendations": ["..."]
  }},
  "ats_score": 0-100
}}

**Do not invent** new experiences—only rephrase what's in the user's resume.

---

**Job Description:**  
{job_description}

**Current Resume:**  
{resume_text}
"""

class ResumeOptimizer:
    def __init__(self, model_name: str = "gemini-2.0-flash"):
        self.model_name = model_name

#Helper functions to clean up the response text
    def _clean_response(self, text: str) -> str:
        # Remove code block delimiters and trailing code block delimiter
        cleaned = re.sub(r"```(?:json)?\s*", "", text)
        cleaned = re.sub(r"```$", "", cleaned)
        return cleaned.strip()

    def _extract_json(self, text: str) -> str:
        """
        Extract the first {...} block by locating the first '{' and the matching last '}'.
        """
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return text[start:end+1]
        return text

    def _validate_schema(self, data: dict) -> None:
        # Validate the JSON response against the expected schema
        if not all(k in data for k in ("optimized_resume", "analysis", "ats_score")):
            raise RuntimeError("Missing one of required top-level keys in JSON")
        analysis = data["analysis"]
        if not all(k in analysis for k in ("strengths", "weaknesses", "recommendations")):
            raise RuntimeError("Analysis block missing required keys")

#Main entry point called by /optimize_resume endpoint. 
# 1. Builds prompt  2. Calls Gemini  3. Cleans & parses JSON
        
    def optimize(self, user_id: str, resume_text: str, job_description: str, dry_run: bool = False) -> dict:
        # Check if the resume text and job description are long enough for meaningful optimization
        if len(resume_text) < 100:
            raise ValueError("Resume text too short for meaningful optimization")
        if len(job_description) < 50:
            raise ValueError("Job description too short for meaningful optimization")

        # Format the prompt with the provided resume text and job description
        prompt = COMPREHENSIVE_OPTIMIZER_PROMPT.format(
            resume_text=resume_text,
            job_description=job_description
        )
        logger.info(f"Starting resume optimization (resume {len(resume_text)} chars, JD {len(job_description)} chars)")

        start = time.time()
        # Initialize the generative model with the specified model name
        model = genai.GenerativeModel(self.model_name)
        resp = model.generate_content(prompt)
        duration = time.time() - start

        raw = resp.text or ""
        logger.info(f"Received {len(raw)} chars from Gemini in {duration:.1f}s")

        # Clean the response text by removing code block delimiters and trailing delimiters
        cleaned = self._clean_response(raw)
        extracted = self._extract_json(cleaned)

        # Attempt to parse the extracted JSON, retrying once after removing trailing commas
        for attempt in (1, 2):
            try:
                result = json.loads(extracted)
                break
            except json.JSONDecodeError as e:
                logger.warning(f"JSON parse error on attempt {attempt}: {e}")
                extracted = re.sub(r",\s*([\]}])", r"\1", extracted)
        else:
            # If both attempts fail, log the final cleaned text and raise an error
            logger.error(f"Final cleaned text:\n{extracted}")
            raise RuntimeError("Failed to parse JSON from Gemini response")

        # Validate the parsed JSON against the expected schema
        self._validate_schema(result)

        # If not in dry run mode, store the optimization results
        if not dry_run:
            store_optimization_results(user_id, {
                "input": {"resume": resume_text, "job_description": job_description},
                "output": result,
                "timestamp": datetime.now(UTC)
            })
        else:
            logger.info("Dry run enabled – skipping persistence")

        return result
