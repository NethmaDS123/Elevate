from features.resume_optimization import ResumeAgentCrew

resume = """
Experienced software engineer skilled in Python, JavaScript, and cloud computing.
Looking for roles that involve backend development and system design.
"""

crew = ResumeAgentCrew().crew()
inputs = {"resume": resume}

try:
    result = crew.kickoff(inputs=inputs)
    print("Optimized Resume:")
    print(result)
except Exception as e:
    print(f"Error: {e}")
