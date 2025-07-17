"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

// Define the structure of the Evaluation object
export interface Evaluation {
  overall_score: number;
  breakdown: {
    innovation: { score: number; analysis: string };
    technical_complexity: { score: number; analysis: string };
    completeness_feasibility: { score: number; analysis: string };
    scalability_maintainability: { score: number; analysis: string };
    industry_relevance: { score: number; analysis: string };
  };
  strengths: string[];
  areas_for_improvement: string[];
  feature_ideas: string[];
  scaling_suggestions: {
    architecture: string[];
    performance: string[];
    user_base: string[];
  };
  market_potential: {
    target_audience: string;
    competitive_advantage: string;
    monetization_options: string[];
  };
  resume_mention: {
    include: boolean;
    justification: string;
  };
}

// Define icons for each evaluation category
export const icons: Record<string, string> = {
  innovation: "FiTrendingUp",
  technical_complexity: "FiCpu",
  completeness_feasibility: "FiCheckCircle",
  scalability_maintainability: "FiSettings",
  industry_relevance: "FiUsers",
};

// Define color gradients for each evaluation category
export const colors: Record<string, string> = {
  innovation: "from-[#8B5CF6]/70 to-[#8B5CF6]",
  technical_complexity: "from-[#8B5CF6]/70 to-[#8B5CF6]",
  completeness_feasibility: "from-[#22C55E]/70 to-[#22C55E]",
  scalability_maintainability: "from-[#F97316]/70 to-[#F97316]",
  industry_relevance: "from-[#8B5CF6]/70 to-[#8B5CF6]",
};

// Define the icon colors for each category
export const iconColors: Record<string, string> = {
  innovation: "text-[#8B5CF6]",
  technical_complexity: "text-[#8B5CF6]",
  completeness_feasibility: "text-[#22C55E]",
  scalability_maintainability: "text-[#F97316]",
  industry_relevance: "text-[#8B5CF6]",
};

export function useProjectEvaluation() {
  const { data: session, status } = useSession(); // Use the session hook to get the session data and status
  const [projectDescription, setProjectDescription] = useState(""); // State for project description

  // Function to update project description
  const updateProjectDescription = useCallback((value: string) => {
    setProjectDescription(value);
  }, []);

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null); // State for evaluation data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(""); // State for error message

  // Define a callback function for form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setEvaluation(null);

      // Check if the user is logged in and if the project description is not empty
      if (!session) {
        setError("You must be logged in to evaluate a project.");
        return;
      }
      if (!projectDescription.trim()) {
        setError("Project description is required.");
        return;
      }

      setLoading(true);
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        // Make a POST request to the backend with the project description
        const res = await fetch(`${backendUrl}/evaluate_project`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.id_token}`,
          },
          body: JSON.stringify({ project_description: projectDescription }),
        });
        const data = await res.json(); // Parse the response as JSON
        if (res.ok) {
          setEvaluation(data.evaluation); // Set the evaluation state if the response is successful
        } else {
          setError(data.error || "Failed to evaluate project");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while evaluating the project");
      } finally {
        setLoading(false);
      }
    },
    [projectDescription, session] // Dependencies for the useCallback hook
  );

  return {
    projectDescription,
    setProjectDescription: updateProjectDescription,
    evaluation,
    loading,
    error,
    handleSubmit,
    session,
    status,
  };
}
