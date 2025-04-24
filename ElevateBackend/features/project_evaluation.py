import os
import re
import json
import uuid
import textwrap
import logging
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, UTC
from database import store_evaluation_result

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load environment variables and configure Gemini
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables!")
genai.configure(api_key=GEMINI_API_KEY)

class ProjectEvaluator:
    """Evaluate software engineering projects with detailed, structured JSON feedback."""

    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name

    def evaluate(self, user_id: str, project_description: str) -> dict:
        """
        Analyze a project and return:
         - overall_score (0-100)
         - breakdown by criterion
         - strengths
         - areas_for_improvement
         - resume_mention (yes/no + justification)

        Persists the raw JSON into your database.
        """
        # Build a JSON-schema prompt
        prompt = textwrap.dedent(f"""
            You are an expert software engineering evaluator. Thoroughly analyze the following project description.

            ## Scoring Criteria:
            1. Innovation (0–100)
            2. Technical Complexity (0–100)
            3. Completeness & Feasibility (0–100)
            4. Scalability & Maintainability (0–100)
            5. Industry Relevance (0–100)

            ## Output **only** valid JSON** matching this schema:
            {{
              "overall_score": <int 0–100>,
              "breakdown": {{
                "innovation": {{ "score": <0–100>, "analysis": "<detailed>" }},
                "technical_complexity": {{ "score": <0–100>, "analysis": "<detailed>" }},
                "completeness_feasibility": {{ "score": <0–100>, "analysis": "<detailed>" }},
                "scalability_maintainability": {{ "score": <0–100>, "analysis": "<detailed>" }},
                "industry_relevance": {{ "score": <0–100>, "analysis": "<detailed>" }}
              }},
              "strengths": [
                "<concise strength 1>",
                "<concise strength 2>"
              ],
              "areas_for_improvement": [
                "<actionable improvement 1>",
                "<actionable improvement 2>"
              ],
              "resume_mention": {{
                "include": <true|false>,
                "justification": "<why it should or should not be on a resume>"
              }}
            }}

            ## Project Description:
            {project_description}
        """)

        try:
            logger.info(f"[{user_id}] Sending project evaluation prompt to Gemini")
            model = genai.GenerativeModel(self.model_name)
            resp = model.generate_content(prompt)
            raw = resp.text.strip()
        except Exception as e:
            logger.exception(f"[{user_id}] Gemini API call failed")
            raise RuntimeError(f"Gemini API Error: {e}")

        # Extract JSON block if fenced, else take entire response
        match = re.search(r"```json\s*(\{[\s\S]+\})\s*```", raw)
        json_str = match.group(1) if match else raw

        try:
            result = json.loads(json_str)
        except json.JSONDecodeError:
            logger.error(f"[{user_id}] Failed to parse JSON:\n{json_str}")
            raise RuntimeError("Failed to parse JSON from Gemini response")

        # Persist into your evaluations collection
        store_evaluation_result(user_id, {
            "evaluation_id": str(uuid.uuid4()),
            "project_description": project_description,
            "evaluation": result,
            "timestamp": datetime.now(UTC)
        })

        logger.info(f"[{user_id}] Project evaluation completed with score {result.get('overall_score')}")
        return result
