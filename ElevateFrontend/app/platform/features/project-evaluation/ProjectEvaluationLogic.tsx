"use client";

import { useState, useCallback, useEffect } from "react";
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
  competitive_landscape: {
    direct_competitors: Array<{
      name: string;
      positioning: string;
      differentiation_strategy: string;
    }>;
    indirect_competitors: string[];
    market_position: string;
  };
  critical_risks: {
    founder_blind_spots: string[];
    market_risks: string[];
    technical_risks: string[];
    business_model_risks: string[];
  };
  resume_mention: {
    include: boolean;
    justification: string;
  };
}

// Define the structure of evaluation personas
export interface EvaluationPersona {
  title: string;
  description: string;
  expertise: string;
}

export interface EvaluationPersonas {
  [key: string]: EvaluationPersona;
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
  const [selectedPersona, setSelectedPersona] = useState("venture_capitalist"); // State for selected persona
  const [personas, setPersonas] = useState<EvaluationPersonas>({
    venture_capitalist: {
      title: "Venture Capitalist",
      description:
        "Ruthless focus on market size, competitive moats, scalability, and monetization potential",
      expertise:
        "25+ years in venture capital with successful exits in tech startups",
    },
    senior_engineer: {
      title: "Senior Engineering Manager",
      description:
        "Technical rigor, code quality, architectural decisions, and hiring potential",
      expertise:
        "20+ years as a principal engineer and engineering manager at FAANG companies",
    },
    product_manager: {
      title: "Senior Product Manager",
      description:
        "User problems, feature cohesiveness, market fit, and user experience",
      expertise:
        "15+ years building successful consumer and B2B products at top tech companies",
    },
  }); // State for available personas with defaults

  // Function to update project description
  const updateProjectDescription = useCallback((value: string) => {
    setProjectDescription(value);
  }, []);

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null); // State for evaluation data
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(""); // State for error message

  // Fetch available personas on component mount
  const fetchPersonas = useCallback(async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";
      console.log(
        "Fetching personas from:",
        `${backendUrl}/evaluation_personas`
      );
      const res = await fetch(`${backendUrl}/evaluation_personas`);
      console.log("Personas fetch response:", res.status, res.ok);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched personas data:", data);
        setPersonas(data.personas);
      } else {
        console.warn("Failed to fetch personas, using defaults");
      }
    } catch (err) {
      console.error("Failed to fetch personas, using defaults:", err);
    }
  }, []);

  // Fetch personas when component mounts
  useEffect(() => {
    fetchPersonas();
  }, [fetchPersonas]);

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
      console.log(`🚀 Starting evaluation with persona: ${selectedPersona}`);
      console.log(
        `📝 Project description length: ${projectDescription.length} characters`
      );
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://elevatebackend.onrender.com";
        // Make a POST request to the backend with the project description
        const res = await fetch(`${backendUrl}/evaluate_project`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.id_token}`,
          },
          body: JSON.stringify({
            project_description: projectDescription,
            persona: selectedPersona,
          }),
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
    [projectDescription, selectedPersona, session] // Dependencies for the useCallback hook
  );

  return {
    projectDescription,
    setProjectDescription: updateProjectDescription,
    selectedPersona,
    setSelectedPersona,
    personas,
    evaluation,
    loading,
    error,
    handleSubmit,
    session,
    status,
  };
}
