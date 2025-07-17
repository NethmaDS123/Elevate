import re
import json
import os
import logging
from datetime import datetime, UTC

import openai
from dotenv import load_dotenv
from database import store_user_feature

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment and configure OpenAI
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables!")
openai.api_key = OPENAI_API_KEY

# Prompt template 
SKILL_BENCHMARK_PROMPT = """
You are an expert career architect and mentor. Given the following resume and targeting the domain "{domain}" for a "{target_role_level}" role, 
perform a comprehensive benchmarking analysis against ideal elite candidates (e.g., MIT/Stanford students, FAANG interns/employees, ICPC winners, 
impactful open-source contributors).

Your analysis must explicitly include:

1. **Detailed Gap Analysis & Comparison**:
   - Clearly highlight strengths with detailed reasoning.
   - Clearly describe critical areas for improvement with explanations comparing the candidate to ideal profiles from top-tier institutions and companies.

2. **Step-by-Step Strategic Career Roadmap**:
   Provide detailed short-term (0-6 months), medium-term (6-18 months), and long-term (18+ months) action plans.
   - Include concrete goals.
   - Recommend specific projects, resources, hackathons, competitive programming platforms, internships, certifications, and activities to reach elite-level 
   standards.
   - Clearly state why each recommended action is important and how it directly closes identified gaps.

3. **Immediate Resume Enhancements**:
   Provide concrete examples of how to rewrite or enhance key sections (e.g., Projects, Work Experience) of the provided resume to highlight quantifiable
   impact aligned with elite standards.

Structure your JSON output exactly as follows:

{{
  "metadata": {{
    "parse_quality": {{
      "skills_extracted": <int>,
      "projects_analyzed": <int>,
      "leadership_roles": <int>,
      "parse_attempts": 1
    }},
    "benchmark_sources": ["MIT CS curriculum", "Google Level {target_role_level} engineer standards", "Stanford AI Lab standards"]
  }},
  "detailed_gap_analysis": {{
    "strengths": [
      {{
        "skill": "<skill>",
        "reasoning": "<detailed reasoning why it's a strength>"
      }}
    ],
    "areas_for_improvement": [
      {{
        "category": "<e.g., Education, Project Scale, Internship Prestige>",
        "current_situation": "<your current status>",
        "ideal_situation": "<elite candidate standard>",
        "urgency": "High/Medium/Low",
        "reasoning": "<detailed explanation of gap and why it matters>"
      }}
    ]
  }},
  "strategic_roadmap": {{
    "short_term_goals": [
      {{
        "timeframe": "0-6 months",
        "goal": "<specific goal>",
        "actions": ["<action 1>", "<action 2>"],
        "reasoning": "<why these actions help achieve elite standards>"
      }}
    ],
    "medium_term_goals": [
      {{
        "timeframe": "6-18 months",
        "goal": "<specific goal>",
        "actions": ["<action 1>", "<action 2>"],
        "reasoning": "<importance of these steps in career progression>"
      }}
    ],
    "long_term_goals": [
      {{
        "timeframe": "18+ months",
        "goal": "<specific goal>",
        "actions": ["<action 1>", "<action 2>"],
        "reasoning": "<how these actions establish industry leadership>"
      }}
    ]
  }},
  "resume_improvements": [
    {{
      "section": "Projects",
      "original": "<original resume text>",
      "improved": "<specific, quantifiable rewritten example>"
    }}
  ]
}}

Resume Text:
\"\"\"{resume_text}\"\"\"

Domain: {domain}
Target Level: {target_role_level}

Return only valid JSON, ensuring highly detailed explanations and actionable insights similar to top-tier career coaching standards.
"""

class SkillBenchmark:
    def __init__(self, model_name: str = "gpt-4o"):
        self.model_name = model_name

    def _clean_response(self, text: str) -> str:
        # Strip markdown fences if present
        text = re.sub(r"```(?:json)?\s*", "", text)
        return re.sub(r"```$", "", text).strip()

    def _run_step(self, prompt: str) -> dict:
        logger.info(f"Sending prompt to OpenAI (size: {len(prompt)} chars)")
        try:
            response = openai.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                timeout=60,  # 60 second timeout
                max_tokens=4000
            )
            
            # Get the response text
            text = response.choices[0].message.content
            
            # Clean out any markdown fencing
            cleaned = self._clean_response(text)
            
            # Strip any stray C0 control chars 
            sanitized = re.sub(r'[^\x09\x0A\x0D\x20-\x7E]', '', cleaned)
            
            try:
                # Allow control characters inside strings on Python 
                return json.loads(sanitized, strict=False)
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing failed after sanitization: {e}\nSanitized response was:\n{sanitized}")
                raise RuntimeError(f"OpenAI JSON parse error: {e}")
                
        except Exception as e:
            logger.error(f"OpenAI API call failed: {str(e)}")
            raise RuntimeError(f"OpenAI API error: {str(e)}")

    def run(self, user_id: str, entry_id: str, resume_text: str, domain: str, target_role_level: str) -> dict:
        if len(resume_text) < 100:
            raise ValueError("Resume text too short for meaningful analysis.")

        # Construct final prompt with dynamic fields
        prompt = SKILL_BENCHMARK_PROMPT.format(
            domain=domain,
            target_role_level=target_role_level,
            resume_text=resume_text
        )

        try:
            # Call OpenAI and parse result
            result = self._run_step(prompt)
            
            # Persist the feature result
            store_user_feature(
                user_id,
                "skill_benchmark",
                {
                    "entry_id": entry_id,
                    "input": {
                        "resume_text": resume_text,
                        "domain": domain,
                        "target_role_level": target_role_level
                    },
                    "output": result,
                    "timestamp": datetime.now(UTC).isoformat()
                }
            )
            
            return result
        except Exception as e:
            logger.error(f"Skill benchmark failed: {str(e)}")
            # Return a simplified error response that the frontend can handle
            return {
                "error": True,
                "message": f"Analysis failed: {str(e)}",
                "metadata": {
                    "parse_quality": {
                        "skills_extracted": 0,
                        "projects_analyzed": 0,
                        "leadership_roles": 0,
                        "parse_attempts": 0
                    },
                    "benchmark_sources": []
                },
                "detailed_gap_analysis": {
                    "strengths": [],
                    "areas_for_improvement": []
                },
                "strategic_roadmap": {
                    "short_term_goals": [],
                    "medium_term_goals": [],
                    "long_term_goals": []
                },
                "resume_improvements": []
            }
