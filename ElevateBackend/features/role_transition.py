# features/role_transition.py

import os
import re
import json
from datetime import datetime, UTC
from typing import Optional

import openai
from database import store_role_transition
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Configure OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found")
openai.api_key = OPENAI_API_KEY

MODEL = "gpt-4o"


class RoleTransition:
    def generate_plan(
        self,
        user_id: str,
        current: str,
        target: str,
        resume_text: Optional[str] = None,
    ) -> dict:
        # If user entered a resume, include it in a fenced block
        resume_section = ""
        if resume_text:
            resume_section = (
                "\nRésumé:\n```text\n"
                + resume_text.strip()
                + "\n```"
            )

        prompt = f"""
You are a senior career coach specializing in tech role transitions. Create a HIGHLY PERSONALIZED transition plan by:

1. Carefully analyzing the provided resume (if available)
2. Identifying transferable skills from {current} role
3. Highlighting specific gaps for {target} role
4. Creating targeted recommendations leveraging their unique background

Return ONLY JSON with this structure:
{{
  "personalizedSummary": {{
    "transferableSkills": [string], 
    "skillGapAnalysis": {{"hardSkills": [string], "softSkills": [string]}},
    "confidenceScore": float  # 0-1 based on resume alignment
  }},
  "skillDevelopment": {{
    "existingToLeverage": [
      {{
        "skill": string,
        "application": string  # How to use in target role
      }}
    ],
    "newToAcquire": [
      {{
        "skill": string,
        "priority": "High/Medium/Low",
        "resources": [{{"type": "course/book/community", "title": string, "url": string}}]
      }}
    ]
  }},
  "projectSuggestions": [
    {{
      "title": string,
      "objective": string,
      "usesExisting": [string],  # Current skills to apply
      "developsNew": [string],   # Target skills to build
      "complexity": "Beginner/Intermediate/Advanced"
    }}
  ],
  "actionPlan": {{
    "immediateActions": [
      {{
        "action": string,
        "reason": string,  # Why specifically for this user
        "metrics": [string]  # How to measure success
      }}
    ],
    "phaseBasedTimeline": [
      {{
        "phase": string,
        "duration": "X-Y months",
        "objectives": [string],
        "successMarkers": [string],
        "confidenceBoosters": [string]  # Low-risk ways to build confidence
      }}
    ]
  }},
  "networkingStrategy": {{
    "targetCompanies": [string],
    "keyRolesToConnect": [string],  # Specific job titles to network with
    "communities": [{{"name": string, "type": "Slack/Discord/Meetup"}}]
  }}
}}

Current role: {current}
Target role: {target}
Resume Analysis: {resume_text if resume_text else "No resume provided - make general recommendations"}

Respond STRICTLY in valid JSON. No Markdown formatting.
"""
        try:
            # Call OpenAI
            response = openai.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                timeout=60,  # 60 second timeout
                max_tokens=4000
            )
            text = response.choices[0].message.content.strip()
            
            # Strip markdown fences if present
            match = re.search(r"```json\s*(\{.*\})\s*```", text, re.DOTALL)
            json_str = match.group(1) if match else text
            plan = json.loads(json_str)
            
            # Persist final plan (with resume snapshot)
            store_role_transition(user_id, {
                "currentRole": current,
                "targetRole": target,
                "resume_text": resume_text,
                "plan": plan,
                "timestamp": datetime.now(UTC)
            })
            return plan
            
        except Exception as e:
            # Log the error and return a simplified error response
            import logging
            logging.error(f"Role transition plan generation failed: {str(e)}")
            
            # Return a simplified error response that the frontend can handle
            return {
                "error": True,
                "message": f"Failed to generate role transition plan: {str(e)}",
                "personalizedSummary": {
                    "transferableSkills": [],
                    "skillGapAnalysis": {"hardSkills": [], "softSkills": []},
                    "confidenceScore": 0
                },
                "skillDevelopment": {
                    "existingToLeverage": [],
                    "newToAcquire": []
                },
                "projectSuggestions": [],
                "actionPlan": {
                    "immediateActions": [],
                    "phaseBasedTimeline": []
                },
                "networkingStrategy": {
                    "targetCompanies": [],
                    "keyRolesToConnect": [],
                    "communities": []
                }
            }
