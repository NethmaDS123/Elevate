import re
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import logging
from datetime import datetime, UTC
from database import store_optimization_results

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment and configure Gemini
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables!")
genai.configure(api_key=GEMINI_API_KEY)

# Prompt templates
INITIAL_SCORER_PROMPT = """**ATS Compliance Auditor**
Analyze ONLY existing resume content for:
1. Key CS sections (Skills, Projects, Education)
2. Technical keyword coverage
3. Existing quantification usage
4. ATS‑friendly formatting

Return JSON:
{
  "initial_score": 0-100,
  "existing_strengths": ["Python mentions", "Project section"],
  "content_gaps": ["No cloud tech", "Missing metrics"],
  "section_completeness": {"skills": true, "projects": false}
}"""

RELEVANCE_ANALYZER_PROMPT = """**Experience Relevance Analyzer**
Analyze alignment between user's experience and job description. Focus on:
1. Technology stack matches
2. Domain relevance
3. Project scope similarity
4. Methodologies used
5. Tools/software mentioned

Return JSON:
{
  "relevance_score": 0-100,
  "relevant_experiences": {
    "work": [
      {
        "position": "Software Engineer",
        "match_reasons": ["Python", "AWS"],
        "match_percent": 75
      }
    ],
    "projects": [
      {
        "project_name": "ML Model",
        "match_reasons": ["Python", "TensorFlow"],
        "match_percent": 60
      }
    ]
  },
  "experience_gaps": [
    {
      "required_skill": "Kubernetes",
      "user_has": false,
      "suggestion": "Containerization project using Docker/Kubernetes"
    }
  ]
}"""

RESTRUCTURER_PROMPT = """**Resume Restructuring Expert**
Improve existing content by:
1. Reordering sections for technical emphasis
2. Rewriting bullets using existing metrics
3. Standardizing headers
4. Improving readability

Return JSON:
{
  "rewritten_resume": "...",
  "structure_changes": ["Reordered sections"],
  "preserved_content": ["All original skills"]
}"""

KEYWORD_INTEGRATOR_PROMPT = """**Keyword Alignment Specialist**
Match existing content to JD using:
1. Synonym mapping
2. Skill rephrasing
3. Technology emphasis

Return JSON:
{
  "aligned_resume": "...",
  "matched_keywords": ["python", "aws"],
  "alignment_score": "85%",
  "original_content_preserved": true
}"""

VERIFIER_PROMPT = """**Optimization Verifier**
Verify improvements using original content only:

Return JSON:
{
  "final_score": 0-100,
  "content_integrity": {
    "new_content_added": false,
    "modified_sections": ["Experience"],
    "original_data_retained": 100
  },
  "optimization_effectiveness": ["Better structure"]
}"""

CAREER_ADVISOR_PROMPT = """**Career Development Advisor**
Provide actionable future suggestions:

Return JSON:
{
  "skill_gaps": ["CI/CD pipelines"],
  "project_suggestions": ["Build CI/CD pipeline demo"],
  "certification_recommendations": ["AWS Certified Developer"],
  "quantification_tips": ["Add test coverage metrics"]
}"""

class ResumeOptimizer:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name

    def _clean_response(self, text: str) -> str:
        # strip markdown fences
        text = re.sub(r"```(?:json)?\s*", "", text)
        text = re.sub(r"```$", "", text)
        return text.strip()

    def _run_step(self, name: str, prompt: str) -> dict:
        logger.info(f"Running step '{name}' (prompt {len(prompt)} chars)")
        model = genai.GenerativeModel(self.model_name)
        resp = model.generate_content(prompt)
        cleaned = self._clean_response(resp.text)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error in {name}: {e}\nCleaned response:\n{cleaned}")
            raise RuntimeError(f"{name} JSON decode failed: {e}")

    def optimize(self, user_id: str, resume_text: str, job_description: str) -> dict:
        if len(resume_text) < 100:
            raise ValueError("Resume text too short")
        if len(job_description) < 50:
            raise ValueError("Job description too short")

        step1 = self._run_step("initial_scorer", INITIAL_SCORER_PROMPT + f"\n\nOriginal Resume:\n{resume_text}")
        step2 = self._run_step("relevance_analyzer",
            RELEVANCE_ANALYZER_PROMPT + f"\n\nOriginal Resume:\n{resume_text}\n\nJob Description:\n{job_description}")
        step3 = self._run_step("restructurer",
            RESTRUCTURER_PROMPT + f"\n\nResume to Restructure:\n{resume_text}")
        rewritten = step3["rewritten_resume"]
        step4 = self._run_step("keyword_integrator",
            KEYWORD_INTEGRATOR_PROMPT + f"\n\nRestructured Resume:\n{rewritten}\n\nJob Description:\n{job_description}")
        aligned = step4["aligned_resume"]
        step5 = self._run_step("verifier",
            VERIFIER_PROMPT + f"\n\nOptimized Resume:\n{aligned}")
        step6 = self._run_step("career_advisor",
            CAREER_ADVISOR_PROMPT + f"\n\nOptimized Resume:\n{aligned}")

        result = {
            "user_id": user_id,
            "initial_assessment": {
                "score": step1["initial_score"],
                "strengths": step1["existing_strengths"],
                "content_gaps": step1["content_gaps"]
            },
            "relevance_analysis": {
                "score": step2["relevance_score"],
                "work_matches": [f"{w['position']} ({w['match_percent']}%)" for w in step2["relevant_experiences"]["work"]],
                "project_matches": [f"{p['project_name']} ({p['match_percent']}%)" for p in step2["relevant_experiences"]["projects"]],
                "skill_gaps": [f"{g['required_skill']}: {g['suggestion']}" for g in step2["experience_gaps"]]
            },
            "optimized_resume": aligned,
            "final_evaluation": {
                "score": step5["final_score"],
                "integrity_check": step5["content_integrity"]
            },
            "career_development": {
                "skills_to_learn": step6["skill_gaps"],
                "project_ideas": step6["project_suggestions"],
                "certifications": step6["certification_recommendations"]
            },
            "timestamp": datetime.now(UTC).isoformat()
        }

        store_optimization_results(user_id, {
            "input": {"resume": resume_text, "job_description": job_description},
            "output": result,
            "timestamp": datetime.now(UTC)
        })

        return result
