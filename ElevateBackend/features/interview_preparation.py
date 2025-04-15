# interviewpreparation.py
import google.generativeai as genai
from dotenv import load_dotenv
import os
import re
import json
from database import store_interview_analysis, store_interview_feedback
from datetime import datetime, UTC

# Load environment variables from .env file
load_dotenv()

# Configure Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables!")

genai.configure(api_key=GEMINI_API_KEY)

# Gemini Model Initialization
model = genai.GenerativeModel('gemini-1.5-flash')

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
            response = model.generate_content(prompt)
            result = response.text.strip()
            # Use regex to extract JSON from markdown formatting if necessary
            json_match = re.search(r"```json\n(.*)\n```", result, re.DOTALL)
            json_str = json_match.group(1).strip() if json_match else result
            analysis_result = json.loads(json_str)
            # Store the successful analysis in the database
            store_interview_analysis(user_id, {
                "question": question,
                "analysis": analysis_result,
                "timestamp": datetime.now(UTC)
            })
            return analysis_result
        except json.JSONDecodeError as e:
            # If parsing fails, store the raw response and error
            error_result = {
                "error": f"JSON parsing error: {str(e)}",
                "raw_response": result
            }
            store_interview_analysis(user_id, {
                "question": question,
                "analysis": error_result,
                "timestamp": datetime.now(UTC)
            })
            return error_result
        except Exception as e:
            error_result = {"error": f"General error: {str(e)}"}
            store_interview_analysis(user_id, {
                "question": question,
                "analysis": error_result,
                "timestamp": datetime.now(UTC)
            })
            return error_result

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
            response = model.generate_content(prompt)
            result = response.text.strip()
            json_match = re.search(r"```json\n(.*)\n```", result, re.DOTALL)
            json_str = json_match.group(1).strip() if json_match else result
            feedback_result = json.loads(json_str)
            store_interview_feedback(user_id, {
                "question": question,
                "user_answer": user_answer,
                "feedback": feedback_result,
                "timestamp": datetime.now(UTC)
            })
            return feedback_result
        except json.JSONDecodeError as e:
            feedback_error = {"error": f"JSON parsing error: {str(e)}", "raw_response": result}
            store_interview_feedback(user_id, {
                "question": question,
                "user_answer": user_answer,
                "feedback": feedback_error,
                "timestamp": datetime.now(UTC)
            })
            return feedback_error
        except Exception as e:
            feedback_error = {"error": f"General error: {str(e)}"}
            store_interview_feedback(user_id, {
                "question": question,
                "user_answer": user_answer,
                "feedback": feedback_error,
                "timestamp": datetime.now(UTC)
            })
            return feedback_error
