import os
import re
import json
import uuid
import logging
import openai
from dotenv import load_dotenv
from datetime import datetime, UTC
from database import store_learning_pathway_result

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load and configure environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY not found")

class LearningPathways:
    def __init__(self, model: str = "gpt-4o"):
        self.model = model

    def generate_pathway(self, user_id: str, topic: str) -> dict:
        pathway_id = str(uuid.uuid4())
        now = datetime.now(UTC)

        # 1. Store initial “processing” state
        store_learning_pathway_result(user_id, {
            "pathway_id": pathway_id,
            "topic": topic,
            "status": "processing",
            "createdAt": now,
            "updatedAt": now
        })
        
        prompt = f"""
You are a senior curriculum architect. Produce a **pure JSON** learning pathway for "{topic}" with the following schema:

{{
  "topic": "{topic}",
  "timeline": "Approximate total duration e.g. Months 0-30",
  "steps": [
    {{
      "step": <int>,
      "title": "<Phase title>",
      "duration": "Months X–Y",
      "core_goals": ["<goal1>", "<goal2>"],
      "topics": [
        {{
          "name": "<main topic>",
          "subtopics": ["<sub1>", "<sub2>"],
          "resources": ["<name> (URL)"],
          "projects": ["<project idea>"]
        }}
      ]
    }}
  ],
  "industry_readiness": ["<tip1>", "<tip2>"],
  "continuous_learning": ["<advanced topic1>"]
}}

Fill in this structure with:
- 5–6 steps (each ~4–6 months)
- Rich core_goals
- 3–5 topics per step, each with 2–4 subtopics, 1–3 resources, 1–2 project ideas
- A final “industry_readiness” array
- A “continuous_learning” array for lifelong growth

Return **only** the JSON.
"""

        # 3. Call the API to generate the learning pathway
        try:
            logger.info(f"[{user_id}] Calling OpenAI for topic='{topic}'")
            resp = openai.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=2000,
            )
        except Exception as e:
            logger.exception(f"[{user_id}] OpenAI API call failed")
            raise

        # 4. Parse out JSON from the response
        raw = resp.choices[0].message.content.strip()
        match = re.search(r"```json\s*(\{[\s\S]+\})\s*```", raw)
        json_str = match.group(1) if match else raw

        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.error(f"[{user_id}] Failed to parse JSON:\n{json_str}")
            raise

        # 5. Persist completed result
        store_learning_pathway_result(user_id, {
            "pathway_id": pathway_id,
            "status": "completed",
            "learning_pathway": data,
            "updatedAt": datetime.now(UTC)
        })

        logger.info(f"[{user_id}] Learning pathway generation succeeded (pathway_id={pathway_id})")
        return {"pathway_id": pathway_id, "learning_pathway": data, "status": "completed"}
