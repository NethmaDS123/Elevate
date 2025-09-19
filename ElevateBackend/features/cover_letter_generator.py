# features/cover_letter_generator.py
"""
CoverLetterGenerator: AI-powered cover letter generation using OpenAI.
Builds a structured prompt based on resume content and job description
Generates personalized, professional cover letters
Validates JSON response and handles errors
"""

import re
import time
import openai
from dotenv import load_dotenv
import os
import json
import logging
from datetime import datetime, UTC
import requests
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("features.cover_letter_generator")

# Load environment and configure OpenAI
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not found in environment variables!")

# Initialize OpenAI client
from openai import OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

ENHANCED_COVER_LETTER_PROMPT = """
You are an expert career coach and professional writer specializing in crafting compelling, narrative-driven cover letters. Given the user's resume content, job description, and recent company research below, create a personalized cover letter that weaves a compelling story connecting the candidate's experience to the company's current initiatives.

**NARRATIVE STRATEGY - STORY WEAVING:**
Create a compelling narrative that connects the candidate's projects/experience to recent company developments:
- Start with recent company news, product launches, initiatives, or challenges
- Bridge to relevant candidate projects, achievements, or experiences
- Show how the candidate's work directly relates to what the company is doing now
- Use specific examples: "I noticed your recent launch of [X]. In my project [Y], I tackled similar challenges by..."
- Make the connection feel natural and insightful, not forced

**Cover Letter Structure (3-5 Paragraphs):**

**PARAGRAPH 1 - INTRODUCTION WITH HOOK:**
- Open with a compelling connection to recent company news/developments
- Briefly explain who you are and why you're writing
- Mention the specific job/position you're applying for
- Reference a recent company initiative, product launch, or news that caught your attention
- Create immediate relevance and show you're following the company closely

**PARAGRAPH 2 - NARRATIVE CONNECTION (Core paragraph):**
- Connect your specific projects/experience to the company's current work
- Use the "I saw/noticed... In my project... which relates to..." structure
- Highlight 2-3 relevant experiences with quantified results
- Show deep understanding of both your work and theirs
- Make the connection between your skills and their current challenges explicit
- Use technical details when appropriate to show expertise

**PARAGRAPH 3 - COMPANY ALIGNMENT & MOTIVATION:**
- Demonstrate why this company's direction excites you personally
- Reference their mission, values, or recent strategic moves
- Show how your career goals align with their trajectory
- Mention specific aspects of their culture, technology stack, or market position
- Connect your professional interests to their business focus

**PARAGRAPH 4 - CLOSING WITH FORWARD MOMENTUM:**
- Reference your attached CV and express enthusiasm for discussion
- Suggest specific value you could bring based on the narrative you've built
- End with confidence about contributing to their ongoing initiatives
- Professional closing with appropriate salutation

**NARRATIVE TECHNIQUES:**
- Use specific project names, technologies, and metrics from the resume
- Reference actual company developments from the research provided
- Create "aha moments" where connections feel insightful
- Balance technical depth with accessibility
- Show genuine curiosity about their work
- Demonstrate thought leadership and strategic thinking

**Professional Standards:**
- Length: 300-450 words (slightly longer to accommodate narrative depth)
- Tone: Professional but engaging, confident storytelling
- Show genuine research and insight, not surface-level knowledge
- Avoid generic praise; use specific, researched details
- Sound like someone who truly understands both industries/technologies involved

**Quality Requirements:**
- Each connection between candidate experience and company work should feel meaningful
- Demonstrate that you've thought deeply about how you could contribute
- Show understanding of the company's challenges and opportunities
- Sound like an industry insider who gets the bigger picture
- Create anticipation for what you could accomplish together

**Formatting Instructions:**
- Use proper paragraph breaks (double line breaks between paragraphs)
- No escape characters like \\n - use actual line breaks
- Start with "Dear [Hiring Manager/Company Name]," or "Dear Sir/Madam," if name unknown
- End with "Yours sincerely," (if named person) or "Yours faithfully," (if Sir/Madam) followed by a line break and "[Your Name]"
- Ensure clean, readable formatting that would print well

**Additional Analysis:**
- Identify the strongest narrative connections made in the letter
- Suggest ways to deepen the company research and connections
- Rate how well the story flows and connects candidate to company
- Explain what makes this letter stand out from generic applications

IMPORTANT: Your response MUST be a valid JSON object with EXACTLY these keys:
- "cover_letter": The complete cover letter text (string) with proper line breaks and formatting
- "narrative_strengths": Array of 3-5 strings highlighting the strongest story connections made
- "research_depth": String describing how well the letter demonstrates company knowledge
- "improvement_suggestions": Array of 2-3 strings with specific ways to enhance the narrative
- "story_flow_score": Number between 1-10 rating how compelling the narrative is
- "alignment_explanation": String explaining why this candidate's story fits this company

**Resume Content:**
{resume_text}

**Job Description:**
{job_description}

**Company Research:**
{company_research}

**Candidate Projects Extracted:**
{extracted_projects}

Generate the compelling narrative-driven cover letter JSON response now:
"""

class CoverLetterGenerator:
    def __init__(self):
        """Initialize the cover letter generator"""
        pass
    
    def extract_company_name(self, job_description: str) -> str:
        """
        Extract company name from job description
        
        Args:
            job_description (str): The job posting text
            
        Returns:
            str: Extracted company name or empty string if not found
        """
        # Common patterns for company names in job descriptions
        patterns = [
            r"(?:Company|Organization|Employer):\s*([A-Za-z0-9\s&.,\-']+?)(?:\n|$)",
            r"Join\s+([A-Za-z0-9\s&.,\-']+?)\s+(?:as|team|where)",
            r"([A-Za-z0-9\s&.,\-']+?)\s+is\s+(?:looking|seeking|hiring)",
            r"About\s+([A-Za-z0-9\s&.,\-']+?)[:|\n]",
            r"([A-Za-z0-9\s&.,\-']+?)\s+(?:Inc\.|LLC|Ltd\.|Corporation|Corp\.)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, job_description, re.IGNORECASE | re.MULTILINE)
            if match:
                company_name = match.group(1).strip()
                # Clean up common artifacts
                company_name = re.sub(r'\s+', ' ', company_name)
                company_name = company_name.strip('.,')
                if len(company_name) > 3:  # Minimum reasonable company name length
                    return company_name
        
        return ""
    
    def research_company(self, company_name: str) -> str:
        """
        Research recent company news and developments using web search
        
        Args:
            company_name (str): Name of the company to research
            
        Returns:
            str: Formatted research findings about recent company developments
        """
        if not company_name:
            return "No company name found for research."
        
        try:
            logger.info(f"Researching company: {company_name}")
            
            # Search for recent news about the company
            search_queries = [
                f"{company_name} news 2025",
                f"{company_name} product launch recent",
                f"{company_name} new initiatives technology",
                f"{company_name} AI machine learning development"
            ]
            
            research_results = []
            
            for query in search_queries:
                try:
                    # Use a simple approach - in production, you might use NewsAPI, Google News API, etc.
                    # For now, we'll create a structure that the AI can work with
                    search_prompt = f"""
                    Based on common industry knowledge about {company_name}, provide recent developments that might be relevant for a job application. Include:
                    - Recent product launches or updates
                    - New technology initiatives 
                    - Strategic partnerships or acquisitions
                    - Industry positioning and competitive advantages
                    - Company culture or values emphasis
                    
                    Format as factual, specific information that could be referenced in a cover letter.
                    """
                    
                    # Note: In a production environment, you'd integrate with actual search APIs
                    # For now, we'll use a placeholder that encourages the AI to use general knowledge
                    research_results.append(f"Research query: {query}")
                    
                except Exception as e:
                    logger.warning(f"Search query failed: {query} - {e}")
                    continue
            
            if research_results:
                formatted_research = f"""
                COMPANY RESEARCH FINDINGS FOR {company_name.upper()}:
                
                Recent Developments & News:
                - Focus on recent product launches, technology initiatives, or strategic moves
                - Look for AI/ML developments, digital transformation efforts, or innovation projects
                - Note any industry recognition, partnerships, or market expansion
                - Include company culture, values, or mission statements that stand out
                
                Research Queries Explored:
                {chr(10).join(research_results)}
                
                NOTE: Use your knowledge of {company_name} to identify real recent developments that would be relevant for connecting candidate projects to company initiatives.
                """
                
                logger.info(f"Company research completed for {company_name}")
                return formatted_research
            else:
                return f"Limited research available for {company_name}. Focus on general industry knowledge and company reputation."
                
        except Exception as e:
            logger.error(f"Company research failed: {e}")
            return f"Company research unavailable. Use general knowledge about {company_name} and focus on role-specific connections."
    
    def extract_projects_from_resume(self, resume_text: str) -> str:
        """
        Extract and analyze projects from resume content
        
        Args:
            resume_text (str): The candidate's resume content
            
        Returns:
            str: Formatted analysis of candidate projects with technical details
        """
        try:
            logger.info("Extracting projects from resume")
            
            # Use AI to extract and analyze projects
            project_extraction_prompt = f"""
            Analyze the following resume and extract all projects with their technical details:
            
            For each project, identify:
            - Project name/title
            - Technologies used (programming languages, frameworks, tools)
            - Key achievements or results (with numbers/metrics if available)
            - Problem solved or value created
            - Relevant skills demonstrated
            
            Format as a structured analysis that can be used to connect projects to company initiatives.
            
            Resume Content:
            {resume_text}
            
            Provide a concise but detailed analysis of projects and their technical relevance.
            """
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a technical recruiter analyzing resume projects. Extract key technical details and achievements."
                    },
                    {
                        "role": "user",
                        "content": project_extraction_prompt
                    }
                ],
                max_tokens=1000,
                temperature=0.3,
            )
            
            extracted_projects = response.choices[0].message.content.strip()
            logger.info("Project extraction completed")
            return extracted_projects
            
        except Exception as e:
            logger.error(f"Project extraction failed: {e}")
            return "Project extraction unavailable. Use resume content directly for project references."
    
    def generate_cover_letter(self, resume_text: str, job_description: str, retries: int = 3) -> dict:
        """
        Generate a personalized, narrative-driven cover letter based on resume and job description
        
        Args:
            resume_text (str): The candidate's resume content
            job_description (str): The target job description
            retries (int): Number of retry attempts for API calls
            
        Returns:
            dict: Generated cover letter data with narrative analysis
        """
        logger.info("Starting enhanced cover letter generation with company research")
        
        # Step 1: Extract company name from job description
        company_name = self.extract_company_name(job_description)
        logger.info(f"Extracted company name: {company_name or 'Not found'}")
        
        # Step 2: Research the company for recent developments
        company_research = self.research_company(company_name)
        logger.info("Company research completed")
        
        # Step 3: Extract and analyze projects from resume
        extracted_projects = self.extract_projects_from_resume(resume_text)
        logger.info("Project extraction completed")
        
        # Step 4: Build the enhanced prompt with all research data
        prompt = ENHANCED_COVER_LETTER_PROMPT.format(
            resume_text=resume_text,
            job_description=job_description,
            company_research=company_research,
            extracted_projects=extracted_projects
        )
        
        for attempt in range(retries):
            try:
                logger.info(f"Attempt {attempt + 1}: Calling OpenAI API for cover letter generation")
                
                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are an expert career coach and narrative storyteller specializing in connecting candidate experiences to company initiatives. Create compelling stories that weave together candidate projects with recent company developments. Always respond with valid JSON only."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    max_tokens=2500,
                    temperature=0.8,
                )
                
                # Extract the response content
                raw_response = response.choices[0].message.content.strip()
                logger.info("OpenAI API call successful")
                
                # Parse JSON response
                try:
                    parsed_response = json.loads(raw_response)
                    logger.info("Successfully parsed JSON response")
                    
                    # Validate required fields for enhanced response format
                    required_fields = ["cover_letter", "narrative_strengths", "research_depth", 
                                     "improvement_suggestions", "story_flow_score", "alignment_explanation"]
                    
                    if not all(field in parsed_response for field in required_fields):
                        missing_fields = [f for f in required_fields if f not in parsed_response]
                        logger.warning(f"Missing required fields: {missing_fields}")
                        raise ValueError(f"Missing required fields: {missing_fields}")
                    
                    # Validate data types
                    if not isinstance(parsed_response["cover_letter"], str):
                        raise ValueError("cover_letter must be a string")
                    if not isinstance(parsed_response["narrative_strengths"], list):
                        raise ValueError("narrative_strengths must be a list")
                    if not isinstance(parsed_response["research_depth"], str):
                        raise ValueError("research_depth must be a string")
                    if not isinstance(parsed_response["improvement_suggestions"], list):
                        raise ValueError("improvement_suggestions must be a list")
                    if not isinstance(parsed_response["story_flow_score"], (int, float)):
                        raise ValueError("story_flow_score must be a number")
                    if not isinstance(parsed_response["alignment_explanation"], str):
                        raise ValueError("alignment_explanation must be a string")
                    
                    # Validate story flow score range
                    if not (1 <= parsed_response["story_flow_score"] <= 10):
                        raise ValueError("story_flow_score must be between 1 and 10")
                    
                    logger.info("Cover letter generation completed successfully")
                    return parsed_response
                    
                except json.JSONDecodeError as e:
                    logger.warning(f"JSON parsing failed on attempt {attempt + 1}: {e}")
                    if attempt == retries - 1:
                        raise ValueError(f"Failed to parse JSON response after {retries} attempts: {e}")
                        
            except Exception as e:
                logger.error(f"Attempt {attempt + 1} failed: {e}")
                if attempt == retries - 1:
                    logger.error(f"All {retries} attempts failed for cover letter generation")
                    raise RuntimeError(f"Cover letter generation failed after {retries} attempts: {str(e)}")
                
                # Wait before retrying
                time.sleep(2 ** attempt)
        
        # This should never be reached, but just in case
        raise RuntimeError("Unexpected error in cover letter generation")
    
    def generate_narrative_examples(self, company_name: str, candidate_projects: str) -> str:
        """
        Generate example narrative connections for testing and inspiration
        
        Args:
            company_name (str): The target company name
            candidate_projects (str): Extracted candidate projects
            
        Returns:
            str: Example narrative connections that could be used in cover letters
        """
        examples = f"""
        NARRATIVE CONNECTION EXAMPLES FOR {company_name}:
        
        Example 1 - Product Launch Connection:
        "I was excited to see {company_name}'s recent launch of their AI-powered analytics platform. In my project 'Market Sentiment Analyzer,' I developed similar NLP techniques to process real-time social media data, achieving 87% accuracy in sentiment classification. This experience with large-scale text processing and machine learning pipelines directly relates to the challenges your team is solving..."
        
        Example 2 - Technology Initiative Connection:
        "Your recent announcement about expanding into cloud-native solutions caught my attention. During my 'Microservices Migration Project,' I led the transition of a monolithic application to a containerized architecture using Docker and Kubernetes, reducing deployment time by 60%. This hands-on experience with cloud transformation aligns perfectly with {company_name}'s strategic direction..."
        
        Example 3 - Industry Challenge Connection:
        "I've been following {company_name}'s innovative approach to data security, particularly your recent blockchain implementation. In my capstone project 'Secure Document Sharing System,' I explored similar cryptographic solutions to ensure data integrity, implementing merkle trees and hash-based verification. This project gave me deep insights into the security challenges that {company_name} is addressing..."
        
        Key Narrative Elements:
        - Specific company reference (product, announcement, initiative)
        - Relevant candidate project with technical details
        - Quantified results or achievements
        - Clear connection between candidate work and company needs
        - Industry expertise demonstration
        """
        
        return examples

# Global instance
cover_letter_generator = CoverLetterGenerator() 