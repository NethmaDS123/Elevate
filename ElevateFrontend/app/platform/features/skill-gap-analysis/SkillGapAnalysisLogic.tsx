"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/components/SidebarContext";

// Define interfaces for type safety
export interface AnalysisData {
  metadata: {
    parse_quality: {
      skills_extracted: number;
      projects_analyzed: number;
      leadership_roles: number;
      parse_attempts: number;
    };
    benchmark_sources: string[];
  };
  detailed_gap_analysis: {
    strengths: {
      skill: string;
      reasoning: string;
    }[];
    areas_for_improvement: {
      category: string;
      current_situation: string;
      ideal_situation: string;
      urgency: string;
      reasoning: string;
    }[];
  };
  strategic_roadmap: {
    short_term_goals: RoadmapItem[];
    medium_term_goals: RoadmapItem[];
    long_term_goals: RoadmapItem[];
  };
  resume_improvements: {
    section: string;
    original: string;
    improved: string;
  }[];
}

// Define interface for roadmap items
export interface RoadmapItem {
  timeframe: string;
  goal: string;
  actions: string[];
  reasoning: string;
}

export function useSkillGapAnalysis() {
  const { data: session, status } = useSession();
  const { isOpen } = useSidebar();
  const [roleLevel, setRoleLevel] = useState("internship");
  const [domain, setDomain] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Handle form submission and API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnalysis(null);

    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://elevatebackend.onrender.com";

    try {
      // Set a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      // Make API request to backend
      const response = await fetch(`${backend}/skill_benchmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.id_token}`,
        },
        body: JSON.stringify({
          resume_text: resumeText,
          target_role_level: roleLevel,
          domain,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok)
        throw new Error(`Analysis failed: ${response.statusText}`);

      const data = await response.json();

      // Check if the response contains an error flag
      if (data.error) {
        throw new Error(data.message || "Analysis failed");
      }

      setAnalysis(data);
    } catch (err) {
      console.error("Skill benchmark error:", err);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(
          "Request timed out. Please try again with a shorter resume or try later."
        );
      } else {
        setError(err instanceof Error ? err.message : "Analysis failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to clear analysis data
  const clearAnalysis = () => {
    setAnalysis(null);
    setError("");
  };

  return {
    // State
    roleLevel,
    setRoleLevel,
    domain,
    setDomain,
    resumeText,
    setResumeText,
    analysis,
    loading,
    error,
    activeTab,
    setActiveTab,
    session,
    status,
    isOpen,

    // Actions
    handleSubmit,
    clearAnalysis,
  };
}
