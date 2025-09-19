#!/usr/bin/env python3
"""
Test script for the enhanced narrative-driven cover letter generator
Demonstrates the new story weaving capabilities
"""

import sys
import os

# Add the ElevateBackend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from features.cover_letter_generator import cover_letter_generator
import json

def test_narrative_cover_letter():
    """Test the enhanced cover letter generation with narrative weaving"""
    
    # Sample resume with projects
    sample_resume = """
    John Smith
    Software Engineer | AI/ML Enthusiast
    
    EXPERIENCE:
    Senior Software Engineer at TechCorp (2022-2024)
    - Led development of real-time analytics platform using Python, React, and AWS
    - Improved system performance by 40% through optimization and caching strategies
    - Mentored 3 junior developers and established code review processes
    
    Software Engineer at DataFlow Inc (2020-2022)
    - Built microservices architecture serving 1M+ users daily
    - Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes
    - Developed machine learning models for predictive analytics with 92% accuracy
    
    PROJECTS:
    Market Sentiment Analyzer (2023)
    - Built NLP system processing 100k+ social media posts daily
    - Used BERT transformers and custom neural networks for sentiment classification
    - Achieved 87% accuracy in sentiment prediction, 23% better than baseline
    - Technologies: Python, TensorFlow, Docker, Redis, PostgreSQL
    
    Smart Traffic Management System (2022)
    - Developed IoT-based traffic optimization using computer vision
    - Reduced traffic congestion by 35% in simulated environments
    - Integrated real-time data processing with ML prediction models
    - Technologies: Python, OpenCV, Kafka, MongoDB, React
    
    Blockchain Voting Platform (2021)
    - Created secure voting system using Ethereum smart contracts
    - Implemented cryptographic verification and merkle tree validation
    - Handled 10,000+ concurrent users with zero security incidents
    - Technologies: Solidity, Web3.js, Node.js, IPFS
    
    EDUCATION:
    Master of Computer Science, Stanford University (2020)
    Bachelor of Computer Science, UC Berkeley (2018)
    
    SKILLS:
    Programming: Python, JavaScript, Java, Solidity
    ML/AI: TensorFlow, PyTorch, Scikit-learn, BERT, NLP
    Cloud: AWS, Docker, Kubernetes, Terraform
    Databases: PostgreSQL, MongoDB, Redis
    """
    
    # Sample job description
    sample_job_description = """
    Senior AI Engineer - Google DeepMind
    
    About Google DeepMind:
    Google DeepMind is at the forefront of artificial intelligence research and development. 
    We recently launched Gemini, our most capable AI model yet, and are working on breakthrough 
    applications in healthcare, climate change, and scientific discovery.
    
    Role Overview:
    We're seeking a Senior AI Engineer to join our team working on large language models and 
    multimodal AI systems. You'll contribute to cutting-edge research while building production-ready 
    AI applications that impact billions of users worldwide.
    
    Key Responsibilities:
    - Develop and optimize large-scale neural networks and transformer architectures
    - Implement novel NLP techniques for improved language understanding
    - Collaborate with research teams on breakthrough AI capabilities
    - Build scalable ML infrastructure for training and inference
    - Contribute to open-source AI tools and research publications
    
    Requirements:
    - MS/PhD in Computer Science, AI, or related field
    - 5+ years of experience in machine learning and deep learning
    - Strong background in NLP, transformers, and language models
    - Experience with TensorFlow, PyTorch, or JAX
    - Publications in top-tier AI conferences (ICML, NeurIPS, ICLR)
    - Experience with distributed computing and large-scale systems
    
    Preferred:
    - Experience with multimodal AI (vision + language)
    - Knowledge of reinforcement learning and AI alignment
    - Contributions to major AI frameworks or tools
    - Experience with cloud platforms (GCP preferred)
    
    Google DeepMind offers competitive compensation, world-class research environment, 
    and the opportunity to work on AI systems that benefit humanity.
    """
    
    print("🚀 Testing Enhanced Narrative-Driven Cover Letter Generation")
    print("=" * 70)
    
    try:
        # Generate the cover letter
        print("📝 Generating cover letter with narrative connections...")
        result = cover_letter_generator.generate_cover_letter(
            resume_text=sample_resume,
            job_description=sample_job_description
        )
        
        print("\n✅ Cover Letter Generated Successfully!")
        print("=" * 70)
        
        # Display the cover letter
        print("\n📄 COVER LETTER:")
        print("-" * 50)
        print(result["cover_letter"])
        
        print("\n\n🎯 NARRATIVE ANALYSIS:")
        print("-" * 50)
        print(f"Story Flow Score: {result['story_flow_score']}/10")
        print(f"\nResearch Depth: {result['research_depth']}")
        
        print(f"\n🔗 Narrative Strengths:")
        for i, strength in enumerate(result["narrative_strengths"], 1):
            print(f"{i}. {strength}")
        
        print(f"\n💡 Improvement Suggestions:")
        for i, suggestion in enumerate(result["improvement_suggestions"], 1):
            print(f"{i}. {suggestion}")
        
        print(f"\n📊 Alignment Explanation:")
        print(result["alignment_explanation"])
        
        print("\n" + "=" * 70)
        print("✨ Test completed successfully! The enhanced cover letter generator")
        print("   now creates compelling narratives that connect candidate projects")
        print("   to company initiatives, making applications much more impactful.")
        
        # Save result to file for review
        with open("/Users/nethmadesilva/Desktop/Projects/Elevate/ElevateBackend/sample_narrative_cover_letter.json", "w") as f:
            json.dump(result, f, indent=2)
        
        print("\n📁 Full result saved to: sample_narrative_cover_letter.json")
        
    except Exception as e:
        print(f"❌ Error during cover letter generation: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_narrative_cover_letter()
