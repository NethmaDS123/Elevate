# features/resume_optimization.py
"""
ResumeOptimizer: end to end résumé enhancement using OpenAI.
Builds a structured prompt (ATS optimised resume + analysis + score)
Sends it to OpenAI
Parses / validates pure JSON response
Persists input + output to MongoDB (via store_optimization_results)
"""

import re
import time
import openai
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

# Load environment and configure OpenAI
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Check if we're in development mode with a dummy key
DEVELOPMENT_MODE = OPENAI_API_KEY == "sk-dummy-key-for-development"
if DEVELOPMENT_MODE:
    logger.warning("Using development mode with mock data for resume optimization")
else:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not found in environment variables!")
    openai.api_key = OPENAI_API_KEY

COMPREHENSIVE_OPTIMIZER_PROMPT = """
You are an expert career coach, resume designer, and ATS-compliance specialist. Given the user's existing resume, formatting details, and the job description below:

1. **Produce an ATS-Optimized Résumé** using only content from the original:
   - Reorder sections to highlight Technologies and Projects first.
   - Rewrite bullets with strong action verbs.
   - Quantify every achievement.
   - Prioritize keywords from the job description.

2. **Analyze**:
   - **Strengths**: 3-5 bullet points of what already matches this JD.
   - **Weaknesses**: 3-5 bullet points of missing or weak areas.
   - **Recommendations**: For each weakness, one actionable step to close the gap.

3. **Format & Design Analysis**:
   - Evaluate the resume's formatting and design based on the provided metadata
   - Assess page count (is it appropriate for experience level?)
   - Evaluate font choices, sizes, and consistency
   - Analyze use of color (professional or distracting?)
   - Assess spacing and layout
   - Provide recommendations for visual improvements

4. **ATS Score Breakdown**:
   - Calculate an overall ATS score (0-100)
   - Break down the score into components:
     - Keyword matching: 0-100
     - Content quality: 0-100
     - Format/readability: 0-100
     - Quantified achievements: 0-100
   - Explain what factors influenced each score component

5. **Human Readability Score**:
   - Calculate how appealing the resume would be to human recruiters (0-100)
   - Assess visual appeal, storytelling, and impact
   - Provide recommendations to improve human appeal

IMPORTANT: Your response MUST be a valid JSON object with EXACTLY these keys:
- "optimized_resume": The full text of the optimized resume
- "analysis": An object containing:
  - "strengths": Array of strings
  - "weaknesses": Array of strings
  - "recommendations": Array of strings
- "ats_score": A number between 0-100
- "format_analysis": An object containing:
  - "page_count_assessment": String
  - "font_assessment": String
  - "color_assessment": String
  - "spacing_assessment": String
  - "overall_design_assessment": String
  - "format_recommendations": Array of strings
- "ats_score_breakdown": An object containing:
  - "keyword_matching": Number between 0-100
  - "content_quality": Number between 0-100
  - "format_readability": Number between 0-100
  - "quantified_achievements": Number between 0-100
- "human_readability": An object containing:
  - "score": Number between 0-100
  - "visual_appeal": String
  - "storytelling": String
  - "impact_assessment": String
  - "improvement_suggestions": Array of strings

DO NOT include any additional text outside the JSON object. DO NOT use single quotes in the JSON. DO NOT include any markdown formatting or code blocks.

**Do not invent** new experiences—only rephrase what's in the user's resume.

---

**Job Description:**  
{job_description}

**Current Resume:**  
{resume_text}

**Resume Formatting Details:**
{format_details}
"""

# Helper function to generate mock data for development mode
def _generate_mock_response():
    return {
        "optimized_resume": "This is a mock optimized resume for development purposes.\n\nTECHNICAL SKILLS\n- Programming Languages: Python, JavaScript, Java\n- Frameworks: React, Node.js, Django\n- Tools: Git, Docker, AWS\n\nEXPERIENCE\nSoftware Engineer | ABC Company | 2020-Present\n- Developed and maintained web applications using React and Node.js\n- Improved application performance by 30% through code optimization\n- Implemented CI/CD pipeline using GitHub Actions\n\nJunior Developer | XYZ Corp | 2018-2020\n- Assisted in developing RESTful APIs using Django\n- Collaborated with team members on agile projects\n- Participated in code reviews and testing",
        "analysis": {
            "strengths": [
                "Strong technical skills that match job requirements",
                "Experience with relevant frameworks",
                "Quantified achievements in previous roles"
            ],
            "weaknesses": [
                "Missing specific keywords from job description",
                "Limited demonstration of leadership experience",
                "Could benefit from more project examples"
            ],
            "recommendations": [
                "Add specific keywords from the job description",
                "Include examples of leadership or team coordination",
                "Add a projects section with relevant work samples"
            ]
        },
        "format_analysis": {
            "page_count_assessment": "The resume is an appropriate length at 1 page, which is ideal for your experience level.",
            "font_assessment": "Using a consistent, professional font throughout the document.",
            "color_assessment": "Minimal color usage keeps the document professional and ATS-friendly.",
            "spacing_assessment": "Good use of white space makes the resume easy to scan.",
            "overall_design_assessment": "Clean, professional design that will work well with ATS systems.",
            "format_recommendations": [
                "Consider adding section dividers for improved readability",
                "Ensure consistent bullet point formatting throughout",
                "Use bold text sparingly to highlight key achievements"
            ]
        },
        "ats_score": 85,
        "ats_score_breakdown": {
            "keyword_matching": 80,
            "content_quality": 85,
            "format_readability": 90,
            "quantified_achievements": 85
        },
        "human_readability": {
            "score": 88,
            "visual_appeal": "The resume has a clean, professional appearance that is visually appealing.",
            "storytelling": "The resume effectively tells your career progression story.",
            "impact_assessment": "Achievements are well-highlighted, but could be more impactful.",
            "improvement_suggestions": [
                "Add a brief professional summary at the top",
                "Use more powerful action verbs to start bullet points",
                "Consider a subtle visual element to make the resume stand out"
            ]
        }
    }

class ResumeOptimizer:
    def __init__(self, model_name: str = "gpt-4o"):
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
        missing_keys = []
        for key in ("optimized_resume", "analysis", "ats_score"):
            if key not in data:
                missing_keys.append(key)
        
        if missing_keys:
            logger.error(f"Missing required top-level keys: {', '.join(missing_keys)}")
            logger.error(f"Keys present in response: {', '.join(data.keys())}")
            raise RuntimeError(f"Missing required top-level keys in JSON: {', '.join(missing_keys)}")
        
        # Check analysis keys
        analysis = data["analysis"]
        missing_analysis_keys = []
        for key in ("strengths", "weaknesses", "recommendations"):
            if key not in analysis:
                missing_analysis_keys.append(key)
        
        if missing_analysis_keys:
            logger.error(f"Missing required analysis keys: {', '.join(missing_analysis_keys)}")
            logger.error(f"Keys present in analysis: {', '.join(analysis.keys())}")
            raise RuntimeError(f"Analysis block missing required keys: {', '.join(missing_analysis_keys)}")
        
        # Validate new fields if they exist
        if "format_analysis" in data:
            format_analysis = data["format_analysis"]
            missing_format_keys = []
            for key in ("page_count_assessment", "format_recommendations"):
                if key not in format_analysis:
                    missing_format_keys.append(key)
            if missing_format_keys:
                logger.error(f"Missing required format_analysis keys: {', '.join(missing_format_keys)}")
                logger.error(f"Keys present in format_analysis: {', '.join(format_analysis.keys())}")
                raise RuntimeError(f"Format analysis block missing required keys: {', '.join(missing_format_keys)}")
        
        if "ats_score_breakdown" in data:
            score_breakdown = data["ats_score_breakdown"]
            missing_score_keys = []
            for key in ("keyword_matching", "content_quality"):
                if key not in score_breakdown:
                    missing_score_keys.append(key)
            if missing_score_keys:
                logger.error(f"Missing required ats_score_breakdown keys: {', '.join(missing_score_keys)}")
                logger.error(f"Keys present in ats_score_breakdown: {', '.join(score_breakdown.keys())}")
                raise RuntimeError(f"ATS score breakdown missing required keys: {', '.join(missing_score_keys)}")
        
        if "human_readability" in data:
            readability = data["human_readability"]
            missing_readability_keys = []
            for key in ("score", "improvement_suggestions"):
                if key not in readability:
                    missing_readability_keys.append(key)
            if missing_readability_keys:
                logger.error(f"Missing required human_readability keys: {', '.join(missing_readability_keys)}")
                logger.error(f"Keys present in human_readability: {', '.join(readability.keys())}")
                raise RuntimeError(f"Human readability block missing required keys: {', '.join(missing_readability_keys)}")

    def _create_fallback_response(self, resume_text: str, job_description: str, raw_response: str = None) -> dict:
        """
        Create a fallback response when the OpenAI API fails to return properly formatted JSON.
        This ensures the user still gets a useful response even if there are API issues.
        """
        logger.warning("Creating fallback response due to API or parsing issues")
        
        # Extract any useful content from the raw response if available
        extracted_text = ""
        if raw_response:
            # Try to find any resume-like content in the raw response
            resume_match = re.search(r"(?:resume|optimized resume|ats resume):\s*(.*?)(?:\n\n|\Z)", 
                                   raw_response, re.IGNORECASE | re.DOTALL)
            if resume_match:
                extracted_text = resume_match.group(1).strip()
            else:
                # Just use a portion of the raw response
                extracted_text = raw_response[:1000] + "..."
        
        # Create a basic optimized resume
        optimized_resume = extracted_text if extracted_text else resume_text
        
        # Extract potential keywords from job description
        keywords = set()
        for word in re.findall(r'\b[A-Za-z][A-Za-z0-9+#]+\b', job_description):
            if len(word) > 3 and word.lower() not in ['and', 'the', 'for', 'with', 'this', 'that']:
                keywords.add(word)
        
        # Calculate a basic score based on keyword matching
        resume_words = set(re.findall(r'\b[A-Za-z][A-Za-z0-9+#]+\b', resume_text.lower()))
        job_words = set(re.findall(r'\b[A-Za-z][A-Za-z0-9+#]+\b', job_description.lower()))
        matching_words = resume_words.intersection(job_words)
        keyword_score = min(100, int(len(matching_words) / len(job_words) * 100)) if job_words else 70
        
        return {
            "optimized_resume": optimized_resume,
            "analysis": {
                "strengths": [
                    "Resume contains relevant skills and experience",
                    "Education and qualifications are appropriate for the role",
                    "Experience is presented in a clear format"
                ],
                "weaknesses": [
                    "Could include more keywords from the job description",
                    "Achievements could be more quantified",
                    "Some sections could be reorganized for better ATS performance"
                ],
                "recommendations": [
                    "Add more keywords from the job description",
                    "Quantify achievements with numbers and percentages",
                    "Reorder sections to highlight most relevant experience first"
                ]
            },
            "format_analysis": {
                "page_count_assessment": "The resume length appears appropriate for your experience level.",
                "font_assessment": "Consider using a more ATS-friendly font throughout the document.",
                "color_assessment": "Minimal color usage is good for ATS compatibility.",
                "spacing_assessment": "Ensure consistent spacing between sections for better readability.",
                "overall_design_assessment": "The design is clean but could be optimized further for ATS systems.",
                "format_recommendations": [
                    "Use standard section headings that ATS systems recognize",
                    "Ensure consistent formatting throughout the document",
                    "Use bullet points for achievements and responsibilities"
                ]
            },
            "ats_score": max(60, keyword_score),
            "ats_score_breakdown": {
                "keyword_matching": keyword_score,
                "content_quality": 75,
                "format_readability": 80,
                "quantified_achievements": 65
            },
            "human_readability": {
                "score": 75,
                "visual_appeal": "The resume has a professional appearance suitable for the industry.",
                "storytelling": "Career progression is clear, but could tell a more compelling story.",
                "impact_assessment": "Achievements are present but could have more impact with quantification.",
                "improvement_suggestions": [
                    "Add a concise professional summary at the top",
                    "Use stronger action verbs to begin bullet points",
                    "Highlight key achievements more prominently"
                ]
            }
        }

#Main entry point called by /optimize_resume endpoint. 
    # 1. Builds prompt  2. Calls OpenAI  3. Cleans & parses JSON
        
    def optimize(self, user_id: str, resume_text: str, job_description: str, format_details: dict = None, dry_run: bool = False) -> dict:
        # Check if the resume text and job description are long enough for meaningful optimization
        if len(resume_text) < 100:
            raise ValueError("Resume text too short for meaningful optimization")
        if len(job_description) < 50:
            raise ValueError("Job description too short for meaningful optimization")

        # If in development mode, return mock data
        if DEVELOPMENT_MODE:
            logger.info("Development mode: Returning mock optimization data")
            result = _generate_mock_response()
            
            # If not in dry_run mode, store the optimization results
            if not dry_run:
                store_optimization_results(user_id, {
                    "input": {
                        "resume": resume_text, 
                        "job_description": job_description,
                        "format_details": format_details
                    },
                    "output": result,
                    "timestamp": datetime.now(UTC)
                })
                
            return result

        # Format the prompt with the provided resume text and job description
        format_details_str = json.dumps(format_details, indent=2) if format_details else "{}"
        prompt = COMPREHENSIVE_OPTIMIZER_PROMPT.format(
            resume_text=resume_text,
            job_description=job_description,
            format_details=format_details_str
        )
        logger.info(f"Starting resume optimization (resume {len(resume_text)} chars, JD {len(job_description)} chars)")

        start = time.time()
        # Call the OpenAI API
        try:
            resp = openai.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            duration = time.time() - start
            raw = resp.choices[0].message.content.strip()
            logger.info(f"Received {len(raw)} chars from OpenAI in {duration:.1f}s")
        except Exception as e:
            logger.error(f"OpenAI API call failed: {str(e)}")
            raise RuntimeError(f"OpenAI API error: {str(e)}")

        # Clean the response text by removing code block delimiters and trailing delimiters
        cleaned = self._clean_response(raw)
        extracted = self._extract_json(cleaned)
        
        # Log the first 500 characters of the response for debugging
        logger.info(f"JSON response preview: {extracted[:500]}...")

        # Attempt to parse the extracted JSON, retrying once after removing trailing commas
        for attempt in (1, 2):
            try:
                result = json.loads(extracted)
                break
            except json.JSONDecodeError as e:
                logger.warning(f"JSON parse error on attempt {attempt}: {e}")
                if attempt == 1:
                    # Fix common JSON issues
                    extracted = re.sub(r",\s*([\]}])", r"\1", extracted)
                    extracted = re.sub(r"'", '"', extracted)  # Replace single quotes with double quotes
        else:
            # If both attempts fail, use fallback response
            logger.error(f"Failed to parse JSON from OpenAI response. Using fallback response.")
            logger.error(f"Raw response preview: {raw[:500]}...")
            result = self._create_fallback_response(resume_text, job_description, raw)
            
            # If not in dry_run mode, store the optimization results
            if not dry_run:
                store_optimization_results(user_id, {
                    "input": {
                        "resume": resume_text, 
                        "job_description": job_description,
                        "format_details": format_details
                    },
                    "output": result,
                    "timestamp": datetime.now(UTC),
                    "fallback_used": True
                })
            return result

        try:
            # Validate the parsed JSON against the expected schema
            self._validate_schema(result)
        except Exception as e:
            # If validation fails, try to fix common issues
            logger.warning(f"Schema validation failed: {str(e)}")
            logger.info("Attempting to fix schema issues...")
            
            try:
                # Ensure required top-level keys exist
                if "optimized_resume" not in result and "resume" in result:
                    logger.info("Fixing: 'resume' -> 'optimized_resume'")
                    result["optimized_resume"] = result.pop("resume")
                    
                if "analysis" not in result:
                    logger.info("Creating missing 'analysis' section")
                    result["analysis"] = {
                        "strengths": ["Strong technical skills", "Relevant experience", "Good education background"],
                        "weaknesses": ["Could improve formatting", "Missing some keywords", "Limited quantifiable achievements"],
                        "recommendations": ["Add more keywords from job description", "Quantify achievements", "Improve formatting"]
                    }
                    
                if "ats_score" not in result and "score" in result:
                    logger.info("Fixing: 'score' -> 'ats_score'")
                    result["ats_score"] = result.pop("score")
                elif "ats_score" not in result:
                    logger.info("Adding default 'ats_score'")
                    result["ats_score"] = 75
                    
                # Validate again after fixes
                self._validate_schema(result)
            except Exception as e2:
                # If fixes fail, use fallback response
                logger.error(f"Failed to fix schema issues: {str(e2)}. Using fallback response.")
                result = self._create_fallback_response(resume_text, job_description, raw)
                
                # If not in dry_run mode, store the optimization results
                if not dry_run:
                    store_optimization_results(user_id, {
                        "input": {
                            "resume": resume_text, 
                            "job_description": job_description,
                            "format_details": format_details
                        },
                        "output": result,
                        "timestamp": datetime.now(UTC),
                        "fallback_used": True
                    })
                return result

        # If not in dry run mode, store the optimization results
        if not dry_run:
            store_optimization_results(user_id, {
                "input": {
                    "resume": resume_text, 
                    "job_description": job_description,
                    "format_details": format_details
                },
                "output": result,
                "timestamp": datetime.now(UTC)
            })
        else:
            logger.info("Dry run enabled – skipping persistence")

        return result
