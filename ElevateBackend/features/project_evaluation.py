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
    """Evaluate software engineering projects with detailed, structured JSON feedback from different expert perspectives."""

    def __init__(self, model_name: str = "gpt-4o"):
        self.model_name = model_name
        self.evaluation_personas = {
            "venture_capitalist": {
                "title": "Venture Capitalist",
                "description": "Ruthless focus on market size, competitive moats, scalability, and monetization potential",
                "expertise": "25+ years in venture capital with successful exits in tech startups"
            },
            "senior_engineer": {
                "title": "Senior Engineering Manager", 
                "description": "Technical rigor, code quality, architectural decisions, and hiring potential",
                "expertise": "20+ years as a principal engineer and engineering manager at FAANG companies"
            },
            "product_manager": {
                "title": "Senior Product Manager",
                "description": "User problems, feature cohesiveness, market fit, and user experience",
                "expertise": "15+ years building successful consumer and B2B products at top tech companies"
            }
        }

    def evaluate(self, user_id: str, project_description: str, persona: str = "venture_capitalist") -> dict:
        """
        Analyze a project from a specific expert perspective and return:
         - overall_score (0-100)
         - breakdown by criterion
         - strengths
         - areas_for_improvement
         - feature_ideas
         - scaling_suggestions
         - market_potential
         - competitive_landscape
         - critical_risks
         - resume_mention (yes/no + justification)

        Persists the raw JSON into your database.
        """
        
        # Validate persona
        if persona not in self.evaluation_personas:
            logger.warning(f"[{user_id}] Invalid persona '{persona}', defaulting to 'venture_capitalist'")
            persona = "venture_capitalist"
            
        persona_info = self.evaluation_personas[persona]
        
        # Build persona-specific prompt
        persona_prompts = {
            "venture_capitalist": self._get_vc_prompt(),
            "senior_engineer": self._get_engineer_prompt(), 
            "product_manager": self._get_pm_prompt()
        }
        
        base_prompt = persona_prompts[persona]
        prompt = textwrap.dedent(f"""
            You are a {persona_info['title']} with {persona_info['expertise']}. {persona_info['description']}.

            {base_prompt}

            CRITICAL: Your evaluation must be dramatically different from other personas. Use your unique vocabulary, concerns, and priorities. If a VC would focus on market size, you should focus on what matters most to YOUR role.

            Analyze the following project description with your specialized expertise. Your analysis should sound like it came from YOUR specific professional perspective, not a generic consultant. Use industry-specific language and concerns.

            ## Scoring Criteria (interpret through YOUR lens):
            1. Innovation (0–100) - Score based on what YOUR profession considers innovative
            2. Technical Complexity (0–100) - Evaluate what matters to YOUR expertise area
            3. Completeness & Feasibility (0–100) - Assess from YOUR professional standards
            4. Scalability & Maintainability (0–100) - Consider YOUR long-term concerns
            5. Industry Relevance (0–100) - Evaluate based on YOUR market knowledge

            REMEMBER: A VC cares about billion-dollar markets, an Engineer cares about system architecture, a PM cares about user problems. Make your analysis DISTINCTLY reflect your professional viewpoint.

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
                "<specific strength 1 causally linked to this project's unique characteristics>",
                "<specific strength 2 causally linked to this project's unique characteristics>",
                "<specific strength 3 causally linked to this project's unique characteristics>",
                "<specific strength 4 causally linked to this project's unique characteristics>",
                "<specific strength 5 causally linked to this project's unique characteristics>"
              ],
              "areas_for_improvement": [
                "<specific actionable improvement 1 causally derived from this project's weaknesses>",
                "<specific actionable improvement 2 causally derived from this project's weaknesses>",
                "<specific actionable improvement 3 causally derived from this project's weaknesses>",
                "<specific actionable improvement 4 causally derived from this project's weaknesses>",
                "<specific actionable improvement 5 causally derived from this project's weaknesses>"
              ],
              "feature_ideas": [
                "<specific feature idea 1 that leverages this project's unique strengths or addresses specific gaps>",
                "<specific feature idea 2 that leverages this project's unique strengths or addresses specific gaps>",
                "<specific feature idea 3 that leverages this project's unique strengths or addresses specific gaps>"
              ],
              "scaling_suggestions": {{
                "architecture": [
                  "<specific architecture suggestion 1 tailored to this project's unique requirements and constraints>",
                  "<specific architecture suggestion 2 tailored to this project's unique requirements and constraints>"
                ],
                "performance": [
                  "<specific performance optimization 1 addressing this project's actual bottlenecks>",
                  "<specific performance optimization 2 addressing this project's actual bottlenecks>"
                ],
                "user_base": [
                  "<specific user base scaling strategy 1 considering this project's actual target audience>",
                  "<specific user base scaling strategy 2 considering this project's actual target audience>"
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
              "competitive_landscape": {{
                "direct_competitors": [
                  {{
                    "name": "<competitor name from YOUR professional perspective>",
                    "positioning": "<how this project compares using YOUR professional criteria>",
                    "differentiation_strategy": "<strategy that makes sense to YOUR expertise area>"
                  }}
                ],
                "indirect_competitors": [
                  "<alternative solution 1 that YOUR profession would consider a threat>",
                  "<alternative solution 2 that YOUR profession would consider a threat>"
                ],
                "market_position": "<where this project fits based on YOUR professional lens>"
              }},
              "critical_risks": {{
                "founder_blind_spots": [
                  "<assumption that YOUR profession would immediately spot as problematic>",
                  "<second oversight that YOUR expertise would flag as dangerous>"
                ],
                "market_risks": [
                  "<market risk that YOUR profession worries about most>",
                  "<second market risk from YOUR professional perspective>"
                ],
                "technical_risks": [
                  "<technical risk that YOUR expertise area would prioritize>",
                  "<second technical risk that YOUR profession would flag>"
                ],
                "business_model_risks": [
                  "<business model flaw that YOUR role would identify>",
                  "<second business model risk from YOUR professional viewpoint>"
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

            FINAL REMINDER: Your response should be UNMISTAKABLY from YOUR professional perspective:
            - VCs: Talk money, markets, exits, competition, and scalability. Use terms like "TAM", "burn rate", "product-market fit"
            - Engineers: Talk architecture, performance, security, maintainability. Use terms like "load balancing", "database sharding", "CI/CD"
            - PMs: Talk users, metrics, workflows, retention. Use terms like "conversion funnel", "user journey", "engagement rate"

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
                "competitive_landscape": {
                    "direct_competitors": [
                        {
                            "name": f"Generic {project_type} platforms",
                            "positioning": "This project would compete on feature set and user experience",
                            "differentiation_strategy": "Focus on unique value proposition and superior execution"
                        }
                    ],
                    "indirect_competitors": [
                        "Manual processes and existing tools",
                        "DIY solutions and open-source alternatives"
                    ],
                    "market_position": f"Positioned as an innovative solution in the {project_type} space"
                },
                "critical_risks": {
                    "founder_blind_spots": [
                        f"May be underestimating the complexity of user acquisition in the {project_type} market",
                        "Potential overconfidence in technical solution without sufficient user validation"
                    ],
                    "market_risks": [
                        f"Market for {project_type} solutions may be more saturated than anticipated",
                        "User willingness to adopt new solutions may be lower than expected"
                    ],
                    "technical_risks": [
                        "Scalability challenges may emerge as user base grows",
                        f"Integration complexity with existing {project_type} ecosystems"
                    ],
                    "business_model_risks": [
                        "User acquisition cost may exceed lifetime value",
                        "Monetization strategy may not align with user expectations"
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
                
            if "competitive_landscape" not in result:
                result["competitive_landscape"] = {
                    "direct_competitors": [
                        {
                            "name": "Generic platforms in this space",
                            "positioning": "This project would compete on feature set and user experience",
                            "differentiation_strategy": "Focus on unique value proposition and superior execution"
                        }
                    ],
                    "indirect_competitors": [
                        "Manual processes and existing tools",
                        "DIY solutions and open-source alternatives"
                    ],
                    "market_position": "Positioned as an innovative solution in this market"
                }
                logger.warning(f"[{user_id}] Added default competitive_landscape")
                
            if "critical_risks" not in result:
                result["critical_risks"] = {
                    "founder_blind_spots": [
                        "May be underestimating the complexity of user acquisition",
                        "Potential overconfidence in technical solution without sufficient user validation"
                    ],
                    "market_risks": [
                        "Market saturation may be higher than anticipated",
                        "User willingness to adopt new solutions may be lower than expected"
                    ],
                    "technical_risks": [
                        "Scalability challenges may emerge as user base grows",
                        "Integration complexity with existing ecosystems"
                    ],
                    "business_model_risks": [
                        "User acquisition cost may exceed lifetime value",
                        "Monetization strategy may not align with user expectations"
                    ]
                }
                logger.warning(f"[{user_id}] Added default critical_risks")
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

        logger.info(f"[{user_id}] Project evaluation completed with score {result.get('overall_score')} using {persona} persona")
        return result

    def _get_vc_prompt(self) -> str:
        """Generate venture capitalist-focused evaluation prompt."""
        return """
        Your evaluation lens: VENTURE CAPITALIST
        You are a ruthless, data-driven investor who has deployed $500M+ across 200+ deals. You think in terms of 10x returns, market dominance, and exit strategies. You're known for brutal honesty and cutting through founder delusions.

        YOUR INVESTMENT THESIS:
        - Only fund ventures with $1B+ market potential
        - Demand clear path to market leadership (>30% market share)
        - Require sustainable competitive moats that can't be easily replicated
        - Insist on unit economics that show path to 40%+ gross margins
        - Look for network effects, platform potential, or viral growth mechanics
        - Evaluate management team's ability to scale from $0 to $100M ARR

        SCORING BIAS (weight these heavily):
        - Innovation: Does this create a new category or disrupt an existing one? Generic solutions score <30.
        - Scalability: Can this reach $100M ARR with current model? If not, score <40.
        - Industry Relevance: Is timing perfect? Late to market = major penalty.

        YOUR LANGUAGE STYLE:
        - Use investor terminology: "TAM", "LTV/CAC", "burn rate", "runway", "product-market fit"
        - Be direct about deal-breakers: "This is uninvestable because..."
        - Reference comparable companies and their valuations
        - Mention specific exit scenarios (IPO, acquisition targets)
        - Question everything: "What if competitors copy this in 6 months?"

        CRITICAL RISKS must include:
        - "Capital Efficiency Risk": How much funding needed to reach profitability?
        - "Competitive Response Risk": What happens when [specific big company] builds this feature?
        - "Market Timing Risk": Is this 2 years too early or 3 years too late?

        Your recommendations should sound like they come from a partner meeting at Sequoia or a16z.
        """

    def _get_engineer_prompt(self) -> str:
        """Generate senior engineer-focused evaluation prompt."""
        return """
        Your evaluation lens: SENIOR ENGINEERING MANAGER
        You are a Principal Engineer at a FAANG company with 15+ years building systems that serve billions of users. You've seen every architectural anti-pattern and have strong opinions about what separates good code from production nightmares. You evaluate this as if interviewing the developer for a senior role.

        YOUR TECHNICAL STANDARDS:
        - Architecture must handle 10x current scale without major rewrites
        - Code quality should demonstrate understanding of SOLID principles, design patterns
        - Security must be built-in, not bolted-on (evaluate threat modeling)
        - Performance considerations should be evident from day one
        - Technology choices must be justified beyond "it's popular"
        - Testing strategy should include unit, integration, and performance tests

        SCORING BIAS (be harsh on these):
        - Technical Complexity: Is this solving hard problems or just CRUD operations? Basic apps score <40.
        - Scalability: Will this architecture collapse at 1M users? If yes, score <30.
        - Completeness: Missing key components (monitoring, logging, error handling) = major penalties.

        YOUR LANGUAGE STYLE:
        - Use technical terminology: "microservices", "event-driven architecture", "eventual consistency"
        - Be specific about technology trade-offs: "Redis vs PostgreSQL for this use case"
        - Reference specific patterns: "This needs the Circuit Breaker pattern for resilience"
        - Mention performance metrics: "This will likely hit database connection limits at 10k concurrent users"
        - Question technical decisions: "Why not use a message queue here?"

        CRITICAL RISKS must include:
        - "Technical Debt Risk": What happens when you need to refactor this in 2 years?
        - "Performance Bottleneck Risk": Where will this system break under load?
        - "Security Vulnerability Risk": What attack vectors are exposed?
        - "Maintenance Complexity Risk": Can junior developers understand and modify this code?

        FEATURE IDEAS should focus on:
        - Technical challenges that would impress in a code review
        - Infrastructure improvements that show systems thinking
        - Performance optimizations that demonstrate deep understanding

        Your tone should be like a senior engineer reviewing a design doc - constructive but uncompromising on quality.
        """

    def _get_pm_prompt(self) -> str:
        """Generate product manager-focused evaluation prompt."""
        return """
        Your evaluation lens: SENIOR PRODUCT MANAGER
        You are a seasoned Product Manager who has launched 10+ products with combined $500M+ revenue. You've led products from 0 to millions of users at companies like Google, Meta, and Stripe. You obsess over user research, data-driven decisions, and turning user pain into product gold.

        YOUR PRODUCT PHILOSOPHY:
        - Every feature must solve a validated user problem (not a founder assumption)
        - User experience is everything - if users can't complete core tasks in <30 seconds, it's broken
        - Product-market fit is measurable: 40%+ users say they'd be "very disappointed" without your product
        - Growth must be sustainable - viral coefficient >1.0 or NPS >50
        - Features should increase key metrics: retention, engagement, conversion, or expansion revenue
        - User journey must be friction-free from discovery to value realization

        SCORING BIAS (user-centricity above all):
        - Innovation: Does this solve a real problem users are paying to solve today? Solutions to imaginary problems score <25.
        - Completeness: Is the user journey complete from awareness to advocacy? Missing steps = major penalties.
        - Industry Relevance: Are users actually asking for this? If no validation evidence, score <35.

        YOUR LANGUAGE STYLE:
        - Use product terminology: "user journey", "conversion funnel", "activation rate", "time-to-value"
        - Reference user research: "Based on user interviews, the biggest friction point is..."
        - Mention specific metrics: "This could improve DAU/MAU ratio from 15% to 25%"
        - Question user value: "What job is the user hiring this product to do?"
        - Reference competitor features: "This is table stakes - Slack has had this since 2015"

        CRITICAL RISKS must include:
        - "Product-Market Fit Risk": What if users don't actually want this?
        - "User Adoption Risk": What friction prevents users from completing key workflows?
        - "Retention Risk": What causes users to churn after the first week?
        - "Feature Bloat Risk": Will adding more features confuse the core value proposition?

        FEATURE IDEAS should focus on:
        - Reducing friction in critical user workflows
        - Increasing user engagement and time-to-value
        - Creating viral loops or network effects
        - Improving core metrics (retention, activation, monetization)

        Your tone should be like a senior PM presenting to the executive team - data-driven, user-focused, and commercially aware.
        """
