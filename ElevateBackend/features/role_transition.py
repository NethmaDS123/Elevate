# features/role_transition.py

import os
import re
import json
from datetime import datetime, UTC
import google.generativeai as genai
from database import store_role_transition 
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Configure Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found")
genai.configure(api_key=GEMINI_API_KEY)

# Pick your model
MODEL = "gemini-1.5-flash"

class RoleTransition:
    def generate_plan(self, user_id: str, current: str, target: str) -> dict:
        prompt = f"""
You are a career expert. Produce **only** a JSON object with exactly these fields:
 {{
   "overview": string,
   "skillsToDevelop": {{
     "technical": [string],
     "soft": [string]
   }},
   "recommendedResources": [{{"type": string, "title": string, "url": string}}],
   "actionSteps": {{
     "shortTerm": [string],
     "longTerm": [string]
   }},
   "timeline": [
     {{
       "phase": string,
       "duration": string,
       "milestones": [string]
     }}
   ]
 }}
  
Current role: "{current}"
Target role: "{target}"
  
Respond with the raw JSON only.
"""
        # call Gemini
        response = genai.GenerativeModel(MODEL).generate_content(prompt)
        text = response.text.strip()
        # strip markdown fences if present
        match = re.search(r"```json\s*(\{.*\})\s*```", text, re.DOTALL)
        json_str = match.group(1) if match else text
        plan = json.loads(json_str)

        # persist
        store_role_transition(user_id, {
            "currentRole": current,
            "targetRole": target,
            "plan": plan,
            "timestamp": datetime.now(UTC)
        })
        return plan
