# features/interview_preparation.py
import os
import re
import json
import openai
from dotenv import load_dotenv
from datetime import datetime, UTC
from database import store_interview_analysis, store_interview_feedback

# Load environment variables from .env file
load_dotenv()

# Configure OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables!")
openai.api_key = OPENAI_API_KEY

# You can change to "gpt-4" or another model as needed
DEFAULT_MODEL = "gpt-4o"

class InterviewPreparation:
    @staticmethod
    def analyze_question(user_id: str, question: str) -> dict:
        prompt = f"""
        As an expert interview coach, provide detailed analysis for this coding question.
        Use this JSON format:
        
        {{
            "question": "original question",
            "approach": [
                {{
                    "step": "Step description",
                    "reasoning": "Why this step matters",
                    "keyOperation": "Main operation performed"
                }}
            ],
            "complexityAnalysis": {{
                "time": {{
                    "value": "O(...)",
                    "explanation": "Detailed breakdown of time complexity sources"
                }},
                "space": {{
                    "value": "O(...)",
                    "explanation": "Detailed breakdown of memory usage sources"
                }},
                "comparison": "When to choose this approach over alternatives"
            }},
            "edgeCases": [
                {{
                    "case": "Edge case description",
                    "handling": "How the solution addresses it",
                    "testExample": "Sample input demonstrating this case"
                }}
            ],
            "sampleSolution": {{
                "code": "Python solution code with comments",
                "codeExplanation": "Line-by-line explanation of key sections"
            }},
            "optimizationTips": [
                {{
                    "tip": "Optimization strategy",
                    "benefit": "Expected improvement",
                    "tradeoff": "Potential downsides"
                }}
            ],
            "commonPitfalls": [
                {{
                    "mistake": "Common error",
                    "consequence": "What goes wrong",
                    "prevention": "How to avoid it"
                }}
            ]
        }}
        Question:
        {question}

        JSON Response:
        """
        try:
            resp = openai.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            raw = resp.choices[0].message.content.strip()
        except Exception as e:
            err = {"error": f"OpenAI API error: {e}"}
            store_interview_analysis(user_id, {
                "question": question,
                "analysis": err,
                "timestamp": datetime.now(UTC)
            })
            return err

        # Extract JSON block
        json_match = re.search(r"```json\s*(\{[\s\S]*\})\s*```", raw)
        json_str = json_match.group(1).strip() if json_match else raw

        # Parse JSON
        try:
            analysis_result = json.loads(json_str)
        except json.JSONDecodeError as e:
            error_result = {
                "error": f"JSON parsing error: {e}",
                "raw_response": raw
            }
            store_interview_analysis(user_id, {
                "question": question,
                "analysis": error_result,
                "timestamp": datetime.now(UTC)
            })
            return error_result

        # Persist successful analysis
        store_interview_analysis(user_id, {
            "question": question,
            "analysis": analysis_result,
            "timestamp": datetime.now(UTC)
        })
        return analysis_result

    @staticmethod
    def feedback_on_answer(user_id: str, question: str, user_answer: str) -> dict:
        prompt = f"""
        Provide detailed feedback on this coding answer using:
    
        {{
            "score": {{
                "overall": 0-10,
                "categories": {{
                    "correctness": 0-5,
                    "efficiency": 0-3,
                    "readability": 0-2
                }}
            }},
            "strengths": ["Well-structured code", "Good edge case handling"],
            "improvementAreas": [
                {{
                    "issue": "Missing null checks",
                    "severity": "High",
                    "suggestion": "Add validation for empty input cases",
                    "example": "if not list1: return list2"
                }}
            ],
            "alternativeApproaches": [
                {{
                    "name": "Recursive approach",
                    "description": "Merge using recursion",
                    "tradeoffs": "O(n) stack space"
                }}
            ],
            "codeQuality": {{
                "structure": "Evaluation of code organization",
                "naming": "Assessment of variable names",
                "bestPractices": "Adherence to PEP8 etc."
            }},
            "recommendedResources": [
                {{
                    "type": "Article",
                    "title": "Linked List Merging Techniques",
                    "url": "https://example.com/list-merge"
                }}
            ]
        }}
    
        Question:
        {question}
    
        User Answer:
        {user_answer}
    
        JSON Response:
        """
        try:
            resp = openai.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            raw = resp.choices[0].message.content.strip()
        except Exception as e:
            err = {"error": f"OpenAI API error: {e}"}
            store_interview_feedback(user_id, {
                "question": question,
                "user_answer": user_answer,
                "feedback": err,
                "timestamp": datetime.now(UTC)
            })
            return err

        # Extract JSON block
        json_match = re.search(r"```json\s*(\{[\s\S]*\})\s*```", raw)
        json_str = json_match.group(1).strip() if json_match else raw

        # Parse JSON
        try:
            feedback_result = json.loads(json_str)
        except json.JSONDecodeError as e:
            feedback_error = {
                "error": f"JSON parsing error: {e}",
                "raw_response": raw
            }
            store_interview_feedback(user_id, {
                "question": question,
                "user_answer": user_answer,
                "feedback": feedback_error,
                "timestamp": datetime.now(UTC)
            })
            return feedback_error

        # Persist successful feedback
        store_interview_feedback(user_id, {
            "question": question,
            "user_answer": user_answer,
            "feedback": feedback_result,
            "timestamp": datetime.now(UTC)
        })
        return feedback_result
