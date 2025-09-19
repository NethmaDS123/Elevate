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

        # 1. Store initial "processing" state
        store_learning_pathway_result(user_id, {
            "pathway_id": pathway_id,
            "topic": topic,
            "status": "processing",
            "createdAt": now,
            "updatedAt": now
        })
        
        prompt = f"""
You are an expert curriculum architect with deep industry knowledge. Create a comprehensive, actionable learning pathway for "{topic}".

Return a **pure JSON** object with this EXACT structure:

{{
  "topic": "{topic}",
  "overview": "Brief 2-3 sentence overview of what learners will achieve",
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "timeline": "Total duration (e.g., 12-18 months)",
  "career_outcomes": ["role1", "role2", "role3"],
  "steps": [
    {{
      "step": 1,
      "title": "Phase title",
      "duration": "2-3 months",
      "skill_level": "Beginner|Intermediate|Advanced",
      "core_goals": ["specific measurable goal 1", "goal 2", "goal 3"],
      "learning_outcomes": ["outcome1", "outcome2"],
      "topics": [
        {{
          "name": "Specific topic name",
          "why_important": "1-2 sentences on relevance",
          "subtopics": ["subtopic1", "subtopic2", "subtopic3"],
          "concepts_to_master": ["concept1", "concept2"],
          "resources": [
            {{
              "title": "Exact resource name",
              "type": "Course|Book|Tutorial|Documentation|Video",
              "url": "https://actual-url.com",
              "duration": "X hours|pages",
              "free": true|false,
              "description": "What this covers"
            }}
          ],
          "practice_resources": [
            {{
              "title": "Practice platform name",
              "url": "https://actual-url.com",
              "description": "Type of practice"
            }}
          ],
          "projects": [
            {{
              "title": "Specific project name",
              "description": "Detailed project description",
              "skills_used": ["skill1", "skill2"],
              "estimated_time": "X hours",
              "difficulty": "Beginner|Intermediate|Advanced",
              "github_search_terms": ["term1", "term2"]
            }}
          ]
        }}
      ],
      "milestone_project": {{
        "title": "Capstone project for this phase",
        "description": "Detailed description",
        "deliverables": ["deliverable1", "deliverable2"],
        "skills_demonstrated": ["skill1", "skill2"]
      }},
      "assessment_ideas": ["assessment1", "assessment2"]
    }}
  ],
  "industry_readiness": [
    {{
      "category": "Technical Skills|Soft Skills|Portfolio",
      "recommendation": "Specific actionable advice",
      "resources": ["resource1", "resource2"]
    }}
  ],
  "continuous_learning": [
    {{
      "area": "Advanced topic area",
      "description": "Why this matters",
      "resources": ["resource1", "resource2"],
      "communities": ["community1", "community2"]
    }}
  ],
  "communities_to_join": [
    {{
      "name": "Community name",
      "platform": "Discord|Reddit|Slack|Forum",
      "url": "https://actual-url.com",
      "description": "What to expect"
    }}
  ],
  "certification_paths": [
    {{
      "name": "Certification name",
      "provider": "Provider name",
      "url": "https://actual-url.com",
      "cost": "$XXX",
      "value": "Why this cert matters"
    }}
  ]
}}

CRITICAL REQUIREMENTS:
1. **MANDATORY**: ALL URLs must be REAL, WORKING links to actual resources. Examples:
   - Coursera: https://www.coursera.org/learn/machine-learning
   - Udemy: https://www.udemy.com/course/complete-python-bootcamp/
   - YouTube: https://www.youtube.com/watch?v=kqtD5dpn9C8
   - FreeCodeCamp: https://www.freecodecamp.org/learn/
   - Khan Academy: https://www.khanacademy.org/computing/computer-programming
   - MDN Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript
   - Python Docs: https://docs.python.org/3/tutorial/
   - Books: https://www.amazon.com/dp/0134685997 (specific ISBNs)
   - GitHub: https://github.com/microsoft/Web-Dev-For-Beginners
   - LeetCode: https://leetcode.com/problemset/all/
   - HackerRank: https://www.hackerrank.com/domains/algorithms

2. **NO FAKE URLs**: Do not use placeholder URLs like "https://example.com" or "https://actual-url.com"

3. Be SPECIFIC - name actual courses, books, tools, platforms with their exact titles

4. Progressive difficulty - each step builds on the previous

5. Mix FREE and paid resources, clearly marking which is which

6. Include modern, up-to-date resources (2022-2024 preferred)

7. For {topic}, include:
   - Industry-standard tools and technologies
   - Real project ideas that build portfolio pieces
   - Specific communities and forums
   - Actual job roles this prepares for

8. Each step should have 3-5 topics

9. Each topic should have 3-5 quality resources with REAL URLs

10. Include time estimates for everything

11. Resources should include mix of video courses, books, interactive tutorials, documentation

12. **VERIFY URLs**: Only include URLs that actually exist and work

13. **Community URLs must be real**: 
    - Discord: https://discord.gg/[actual-invite-code]
    - Reddit: https://www.reddit.com/r/[actual-subreddit]
    - Stack Overflow: https://stackoverflow.com/questions/tagged/[actual-tag]

14. **Certification URLs must be real**: 
    - AWS: https://aws.amazon.com/certification/
    - Google: https://cloud.google.com/certification
    - Microsoft: https://docs.microsoft.com/en-us/learn/certifications/

**FINAL VALIDATION CHECKLIST before returning JSON:**
- [ ] All URLs point to real, accessible resources (no placeholders)
- [ ] Course names match actual course titles on platforms
- [ ] Book titles include real ISBN numbers or publisher links
- [ ] Community links point to active, relevant communities
- [ ] Certification URLs link to official certification programs
- [ ] Each resource has accurate duration and pricing information

Generate a comprehensive pathway that someone could actually follow step-by-step to master {topic}.

**IMPORTANT**: Before finalizing, mentally verify each URL exists and is relevant to {topic}.

Return ONLY the JSON, no additional text."""

        # 3. Call the API to generate the learning pathway
        try:
            logger.info(f"[{user_id}] Calling OpenAI for topic='{topic}'")
            resp = openai.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,  # Slightly higher for more creative resources
                max_tokens=4000,  # Increased for richer content
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
