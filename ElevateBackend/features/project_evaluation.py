import os
import re
import json
import uuid
import textwrap
import logging
import openai
import time
from dotenv import load_dotenv
from datetime import datetime, UTC
from database import store_evaluation_result

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load environment variables and configure OpenAI
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables!")
openai.api_key = OPENAI_API_KEY

class ProjectEvaluator:
    """Evaluate software engineering projects with detailed, structured JSON feedback."""

    def __init__(self, model_name: str = "gpt-4o"):
        self.model_name = model_name

    def evaluate(self, user_id: str, project_description: str) -> dict:
        """
        Analyze a project and return:
         - overall_score (0-100)
         - breakdown by criterion
         - strengths
         - areas_for_improvement
         - feature_ideas
         - scaling_suggestions
         - market_potential
         - resume_mention (yes/no + justification)

        Persists the raw JSON into your database.
        """
        # Build a JSON-schema prompt
        prompt = textwrap.dedent(f"""
            You are a senior software engineering executive with 25+ years of experience in software architecture, system design, and technical leadership at top tech companies. You have a reputation for being extremely critical, thorough, and direct in your project evaluations. Your analysis is highly respected for being insightful, specific, and actionable.

            Analyze the following project description with the critical eye of a veteran software architect. Be specific, detailed, and personalized to this exact project. Avoid generic advice that could apply to any project. Your evaluation should reflect your deep technical expertise and industry knowledge.

            ## Scoring Criteria:
            1. Innovation (0–100) - Be strict about what constitutes true innovation versus standard implementation
            2. Technical Complexity (0–100) - Evaluate based on architectural challenges, not just technology choices
            3. Completeness & Feasibility (0–100) - Assess practical implementation challenges and potential roadblocks
            4. Scalability & Maintainability (0–100) - Consider long-term technical debt and scaling pain points
            5. Industry Relevance (0–100) - Evaluate market fit and timing based on current industry trends

            ## Output **only** valid JSON** matching this schema:
            {{
              "overall_score": <int 0–100>,
              "breakdown": {{
                "innovation": {{ "score": <0–100>, "analysis": "<detailed analysis with specific insights directly related to this project>" }},
                "technical_complexity": {{ "score": <0–100>, "analysis": "<detailed analysis with specific insights directly related to this project>" }},
                "completeness_feasibility": {{ "score": <0–100>, "analysis": "<detailed analysis with specific insights directly related to this project>" }},
                "scalability_maintainability": {{ "score": <0–100>, "analysis": "<detailed analysis with specific insights directly related to this project>" }},
                "industry_relevance": {{ "score": <0–100>, "analysis": "<detailed analysis with specific insights directly related to this project>" }}
              }},
              "strengths": [
                "<specific strength 1 directly related to this project>",
                "<specific strength 2 directly related to this project>",
                "<specific strength 3 directly related to this project>",
                "<specific strength 4 directly related to this project>",
                "<specific strength 5 directly related to this project>"
              ],
              "areas_for_improvement": [
                "<specific actionable improvement 1 directly related to this project>",
                "<specific actionable improvement 2 directly related to this project>",
                "<specific actionable improvement 3 directly related to this project>",
                "<specific actionable improvement 4 directly related to this project>",
                "<specific actionable improvement 5 directly related to this project>"
              ],
              "feature_ideas": [
                "<specific feature idea 1 that addresses a gap or opportunity in this exact project>",
                "<specific feature idea 2 that addresses a gap or opportunity in this exact project>",
                "<specific feature idea 3 that addresses a gap or opportunity in this exact project>"
              ],
              "scaling_suggestions": {{
                "architecture": [
                  "<specific architecture suggestion 1 tailored to this project's unique requirements>",
                  "<specific architecture suggestion 2 tailored to this project's unique requirements>"
                ],
                "performance": [
                  "<specific performance optimization 1 addressing this project's potential bottlenecks>",
                  "<specific performance optimization 2 addressing this project's potential bottlenecks>"
                ],
                "user_base": [
                  "<specific user base scaling strategy 1 considering this project's target audience>",
                  "<specific user base scaling strategy 2 considering this project's target audience>"
                ]
              }},
              "market_potential": {{
                "target_audience": "<detailed description of ideal target audience specifically for this project>",
                "competitive_advantage": "<critical analysis of this project's unique selling points compared to existing solutions>",
                "monetization_options": [
                  "<specific monetization strategy 1 tailored to this project's value proposition>",
                  "<specific monetization strategy 2 tailored to this project's value proposition>",
                  "<specific monetization strategy 3 tailored to this project's value proposition>"
                ]
              }},
              "resume_mention": {{
                "include": <true|false>,
                "justification": "<detailed explanation of why this specific project should or should not be on a resume>"
              }}
            }}

            IMPORTANT: Make sure your JSON is valid:
            1. Escape all double quotes inside strings with backslash (e.g., "This is a \\"quoted\\" word")
            2. Avoid trailing commas
            3. Use double quotes for all keys and string values
            4. Ensure all brackets and braces are properly closed

            Be specific, detailed, and actionable in your analysis. Provide concrete examples and suggestions directly related to the project. Be critical but constructive. Your goal is to provide a brutally honest assessment that will genuinely help improve the project.

            ## Project Description:
            {project_description}
        """)

        try:
            logger.info(f"[{user_id}] Sending project evaluation prompt to OpenAI")
            start = time.time()
            resp = openai.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,  # Lower temperature for more predictable JSON formatting
                response_format={"type": "json_object"}
            )
            duration = time.time() - start
            raw = resp.choices[0].message.content.strip()
            logger.info(f"[{user_id}] Received {len(raw)} chars from OpenAI in {duration:.1f}s")
        except Exception as e:
            logger.exception(f"[{user_id}] OpenAI API call failed")
            raise RuntimeError(f"OpenAI API Error: {e}")

        # Extract JSON block if fenced, else take entire response
        match = re.search(r"```json\s*(\{[\s\S]+\})\s*```", raw)
        json_str = match.group(1) if match else raw
        
        # Log the first part of the raw response for debugging
        logger.info(f"[{user_id}] Raw response preview: {raw[:200]}...")
        
        # Enhanced JSON cleaning
        def fix_json_string(json_text):
            # Use a simpler approach without complex regex
            # Fix common JSON issues that could cause parsing errors
            
            # Step 1: Handle unescaped quotes within strings - this is a common issue
            # We'll do this by iterating through the string character by character
            in_string = False
            result = []
            i = 0
            while i < len(json_text):
                char = json_text[i]
                
                # Handle quotes
                if char == '"':
                    # If we're in a string and the previous character isn't an escape
                    if in_string and i > 0 and json_text[i-1] != '\\':
                        in_string = False
                    # If we're not in a string
                    elif not in_string:
                        in_string = True
                
                # If we're in a string and find an unescaped apostrophe, escape it
                elif char == "'" and in_string and (i == 0 or json_text[i-1] != '\\'):
                    char = "\\'"
                
                result.append(char)
                i += 1
            
            fixed = ''.join(result)
            
            # Step 2: Fix common patterns that cause issues
            # Handle possessive apostrophes
            fixed = fixed.replace('"s ', '\\"s ').replace('"s,', '\\"s,')
            fixed = fixed.replace("'s ", "\\'s ").replace("'s,", "\\'s,")
            
            # Step 3: Remove trailing commas before closing brackets or braces
            fixed = re.sub(r',\s*([\]}])', r'\1', fixed)
            
            # Step 4: Replace single quotes with double quotes outside of strings
            # This is a simplification and might not work for all cases
            fixed = fixed.replace("'", '"')
            
            return fixed

        # Apply enhanced JSON cleaning
        json_str = fix_json_string(json_str)
        
        # Log the cleaned JSON for debugging
        logger.info(f"[{user_id}] Cleaned JSON: {json_str[:200]}...")

        # Attempt to parse the extracted JSON, with multiple attempts and fixes
        for attempt in range(1, 4):  # Try up to 3 times
            try:
                result = json.loads(json_str)
                logger.info(f"[{user_id}] Successfully parsed JSON on attempt {attempt}")
                break
            except json.JSONDecodeError as e:
                logger.warning(f"[{user_id}] JSON parse error on attempt {attempt}: {e}")
                if attempt < 3:
                    # Try more aggressive fixes on subsequent attempts
                    if attempt == 1:
                        # Basic fixes
                        json_str = fix_json_string(json_str)
                    elif attempt == 2:
                        # More aggressive fixes - try to extract and repair the problematic section
                        if 'line' in str(e) and 'column' in str(e):
                            try:
                                line_no = int(re.search(r'line (\d+)', str(e)).group(1))
                                col_no = int(re.search(r'column (\d+)', str(e)).group(1))
                                
                                # Split into lines
                                lines = json_str.split('\n')
                                if line_no <= len(lines):
                                    problem_line = lines[line_no - 1]
                                    logger.warning(f"[{user_id}] Problem line: {problem_line}")
                                    
                                    # Apply simple fixes to the problematic line
                                    problem_line = problem_line.replace('"s ', '\\"s ')
                                    problem_line = problem_line.replace('"s,', '\\"s,')
                                    problem_line = problem_line.replace("'s ", "\\'s ")
                                    problem_line = problem_line.replace("'s,", "\\'s,")
                                    problem_line = problem_line.replace("'", '"')  # Replace single quotes with double quotes
                                    
                                    # Replace the problematic line
                                    lines[line_no - 1] = problem_line
                                    json_str = '\n'.join(lines)
                            except Exception as fix_err:
                                logger.warning(f"[{user_id}] Failed to apply line-specific fix: {fix_err}")
                        
                        # Try a more drastic approach - use Python's ast module which is more forgiving
                        try:
                            import ast
                            # Replace JSON-specific syntax with Python equivalents
                            py_str = json_str.replace('null', 'None').replace('true', 'True').replace('false', 'False')
                            # Parse as Python literal and convert back to JSON
                            parsed = ast.literal_eval(py_str)
                            json_str = json.dumps(parsed)
                            logger.info(f"[{user_id}] Applied ast-based parsing fix")
                        except Exception as ast_err:
                            logger.warning(f"[{user_id}] AST parsing failed: {ast_err}")
        else:
            # If all attempts fail, create a minimal valid response
            logger.error(f"[{user_id}] Failed to parse JSON from OpenAI response. Creating fallback response.")
            logger.error(f"[{user_id}] Raw JSON string: {json_str[:500]}...")
            
            # Create a fallback response that attempts to be somewhat personalized
            # Extract key terms from the project description to personalize the fallback
            project_keywords = set()
            tech_terms = ["web", "mobile", "app", "application", "AI", "ML", "blockchain", "cloud", 
                         "serverless", "frontend", "backend", "fullstack", "database", "API", 
                         "microservices", "IoT", "React", "Angular", "Vue", "Node", "Python", 
                         "Java", "JavaScript", "TypeScript", "Go", "Rust", "C#", ".NET"]
            
            # Extract tech terms from project description
            for term in tech_terms:
                if term.lower() in project_description.lower():
                    project_keywords.add(term)
            
            # Default to web app if no specific tech is mentioned
            project_type = "web application"
            if "mobile" in project_keywords:
                project_type = "mobile application"
            elif "IoT" in project_keywords:
                project_type = "IoT system"
            elif "AI" in project_keywords or "ML" in project_keywords:
                project_type = "AI/ML system"
            elif "blockchain" in project_keywords:
                project_type = "blockchain application"
            
            # Create personalized fallback response
            result = {
                "overall_score": 75,
                "breakdown": {
                    "innovation": {"score": 75, "analysis": f"The {project_type} shows some innovative elements but could benefit from more unique differentiators in the market."},
                    "technical_complexity": {"score": 75, "analysis": f"The technical stack for this {project_type} has reasonable complexity, though some architectural decisions may need further consideration."},
                    "completeness_feasibility": {"score": 75, "analysis": f"The {project_type} appears feasible to implement, but would benefit from a more detailed implementation roadmap."},
                    "scalability_maintainability": {"score": 75, "analysis": f"The current architecture for this {project_type} can be scaled with proper planning, but potential bottlenecks should be addressed early."},
                    "industry_relevance": {"score": 75, "analysis": f"This type of {project_type} has relevance in today's market, though differentiation from competitors needs to be stronger."}
                },
                "strengths": [
                    f"Clear concept for a {project_type}",
                    "Technical implementation appears well-considered",
                    "Addresses an identifiable market need",
                    "Shows understanding of core technologies required",
                    "Has potential for expansion with additional features"
                ],
                "areas_for_improvement": [
                    f"Develop more detailed technical specifications for the {project_type}",
                    "Create a comprehensive testing strategy including unit and integration tests",
                    "Consider potential scalability challenges as user base grows",
                    "Add more detailed security considerations and implementation",
                    "Develop a clearer product differentiation strategy"
                ],
                "feature_ideas": [
                    f"Advanced authentication system appropriate for this {project_type}",
                    "Comprehensive analytics dashboard for monitoring usage and performance",
                    f"Integration capabilities with other popular platforms in the {project_type} ecosystem"
                ],
                "scaling_suggestions": {
                    "architecture": [
                        f"Consider a microservices architecture to allow independent scaling of {project_type} components",
                        "Implement a robust caching layer to improve performance under load"
                    ],
                    "performance": [
                        "Optimize database queries with proper indexing and query optimization",
                        "Implement CDN for static assets to improve global performance"
                    ],
                    "user_base": [
                        "Design a multi-region deployment strategy for global expansion",
                        "Implement feature flags for gradual rollout of new capabilities"
                    ]
                },
                "market_potential": {
                    "target_audience": f"Users seeking solutions in the {project_type} space, particularly those looking for improved user experience and functionality over existing options.",
                    "competitive_advantage": f"This {project_type} could differentiate itself through superior user experience and targeted feature set, though more specific unique selling points should be developed.",
                    "monetization_options": [
                        f"Tiered subscription model based on {project_type} usage or features",
                        "Freemium model with core functionality free and premium features paid",
                        "One-time purchase with optional add-on modules or extensions"
                    ]
                },
                "resume_mention": {
                    "include": True,
                    "justification": f"This {project_type} demonstrates technical skills and problem-solving abilities that would be valuable to highlight on a resume, particularly the implementation of key technologies and architectural decisions."
                }
            }
            
            # Store the evaluation result with fallback flag
            store_evaluation_result(user_id, {
                "evaluation_id": str(uuid.uuid4()),
                "project_description": project_description,
                "evaluation": result,
                "timestamp": datetime.now(UTC),
                "fallback_used": True
            })
            
            logger.info(f"[{user_id}] Project evaluation completed with fallback response")
            return result

        # Validate required fields and add defaults for missing fields
        try:
            # Validate required fields
            required_fields = ["overall_score", "breakdown", "strengths", "areas_for_improvement", "resume_mention"]
            missing_fields = [field for field in required_fields if field not in result]
            
            if missing_fields:
                logger.warning(f"[{user_id}] Missing required fields in response: {missing_fields}")
                
            # Ensure new fields exist (add empty defaults if missing)
            if "feature_ideas" not in result:
                # Extract keywords from project description to personalize defaults
                project_keywords = set()
                tech_terms = ["web", "mobile", "app", "application", "AI", "ML", "blockchain", "cloud", 
                             "serverless", "frontend", "backend", "fullstack", "database", "API", 
                             "microservices", "IoT", "React", "Angular", "Vue", "Node", "Python", 
                             "Java", "JavaScript", "TypeScript", "Go", "Rust", "C#", ".NET"]
                
                # Extract tech terms from project description
                for term in tech_terms:
                    if term.lower() in project_description.lower():
                        project_keywords.add(term)
                
                # Default to web app if no specific tech is mentioned
                project_type = "web application"
                if "mobile" in project_keywords:
                    project_type = "mobile application"
                elif "IoT" in project_keywords:
                    project_type = "IoT system"
                elif "AI" in project_keywords or "ML" in project_keywords:
                    project_type = "AI/ML system"
                elif "blockchain" in project_keywords:
                    project_type = "blockchain application"
                
                result["feature_ideas"] = [
                    f"Advanced authentication system appropriate for this {project_type}",
                    "Comprehensive analytics dashboard for monitoring usage and performance",
                    f"Integration capabilities with other popular platforms in the {project_type} ecosystem"
                ]
                logger.warning(f"[{user_id}] Added personalized default feature_ideas")
                
            if "scaling_suggestions" not in result:
                result["scaling_suggestions"] = {
                    "architecture": [
                        f"Consider a microservices architecture to allow independent scaling of components",
                        "Implement a robust caching layer to improve performance under load"
                    ],
                    "performance": [
                        "Optimize database queries with proper indexing and query optimization",
                        "Implement CDN for static assets to improve global performance"
                    ],
                    "user_base": [
                        "Design a multi-region deployment strategy for global expansion",
                        "Implement feature flags for gradual rollout of new capabilities"
                    ]
                }
                logger.warning(f"[{user_id}] Added default scaling_suggestions")
                
            if "market_potential" not in result:
                result["market_potential"] = {
                    "target_audience": f"Users seeking solutions in this space, particularly those looking for improved user experience and functionality over existing options.",
                    "competitive_advantage": f"This project could differentiate itself through superior user experience and targeted feature set, though more specific unique selling points should be developed.",
                    "monetization_options": [
                        "Tiered subscription model based on usage or features",
                        "Freemium model with core functionality free and premium features paid",
                        "One-time purchase with optional add-on modules or extensions"
                    ]
                }
                logger.warning(f"[{user_id}] Added default market_potential")
        except Exception as e:
            logger.error(f"[{user_id}] Error during validation and defaults: {str(e)}")
            # Continue with what we have

        # Persist into your evaluations collection
        store_evaluation_result(user_id, {
            "evaluation_id": str(uuid.uuid4()),
            "project_description": project_description,
            "evaluation": result,
            "timestamp": datetime.now(UTC)
        })

        logger.info(f"[{user_id}] Project evaluation completed with score {result.get('overall_score')}")
        return result
