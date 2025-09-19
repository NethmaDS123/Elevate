"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

// ------------------
// Type Definitions
// ------------------

export interface Resource {
  title: string;
  type: "Course" | "Book" | "Tutorial" | "Documentation" | "Video";
  url: string;
  duration: string;
  free: boolean;
  description: string;
}

export interface PracticeResource {
  title: string;
  url: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  skills_used: string[];
  estimated_time: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  github_search_terms: string[];
}

export interface Topic {
  name: string;
  why_important?: string;
  subtopics?: string[];
  concepts_to_master?: string[];
  resources?: (Resource | string)[];
  practice_resources?: PracticeResource[];
  projects?: (Project | string)[];
}

export interface MilestoneProject {
  title: string;
  description: string;
  deliverables?: string[];
  skills_demonstrated?: string[];
}

export interface Step {
  step: number;
  title: string;
  duration: string;
  skill_level?: "Beginner" | "Intermediate" | "Advanced";
  core_goals: string[];
  learning_outcomes?: string[];
  topics: Topic[];
  milestone_project?: MilestoneProject;
  assessment_ideas?: string[];
}

export interface IndustryReadiness {
  category: "Technical Skills" | "Soft Skills" | "Portfolio";
  recommendation: string;
  resources?: string[];
}

export interface ContinuousLearning {
  area: string;
  description: string;
  resources?: string[];
  communities?: string[];
}

export interface Community {
  name: string;
  platform: "Discord" | "Reddit" | "Slack" | "Forum";
  url: string;
  description: string;
}

export interface Certification {
  name: string;
  provider: string;
  url: string;
  cost: string;
  value: string;
}

export interface Pathway {
  topic: string;
  overview?: string;
  prerequisites?: string[];
  timeline: string;
  career_outcomes?: string[];
  steps: Step[];
  industry_readiness?: (IndustryReadiness | string)[];
  continuous_learning?: (ContinuousLearning | string)[];
  communities_to_join?: Community[];
  certification_paths?: Certification[];
}

// ------------------
// Example Topics Data
// ------------------

export const exampleTopics = [
  "Computer Science",
  "Data Science",
  "Computer Architecture",
  "Web Development",
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "Databases",
  "Software Engineering",
  "Distributed Systems",
  "Cybersecurity",
  "Machine Learning",
  "DevOps",
  "Blockchain",
  "AI",
  "Cloud Computing",
];

// ------------------
// Custom Hook
// ------------------

export function useLearningPaths() {
  const { data: session, status } = useSession();
  const [searchTopic, setSearchTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  // Save pathway states
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Function to fetch the learning pathway based on the topic
  const fetchLearningPathway = async (topic: string) => {
    setError(""); // Clear any existing error messages
    setPathway(null); // Reset the pathway state
    setIsSaved(false); // Reset saved state when generating new pathway

    if (!session || !session.user) {
      setError("You must be logged in to generate a pathway.");
      return;
    }

    const token = session.user.id_token;
    if (!token) {
      setError(
        "Authentication token not available. Please try logging in again."
      );
      return;
    }

    setLoading(true);
    try {
      console.log("🔧 Environment check:");
      console.log(
        "NEXT_PUBLIC_BACKEND_URL:",
        process.env.NEXT_PUBLIC_BACKEND_URL
      );

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";
      const res = await fetch(`${backendUrl}/learning_pathways`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to fetch learning pathway");
      } else if (data.status === "completed") {
        setPathway(data.learning_pathway as Pathway);
      } else {
        setError("Pathway generation in progress or failed");
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the search form submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTopic.trim()) {
      await fetchLearningPathway(searchTopic.trim());
    }
  };

  // Function to handle example topic clicks
  const handleExampleClick = async (topic: string) => {
    setSearchTopic(topic);
    await fetchLearningPathway(topic);
  };

  // Progress tracking functions
  const toggleItemCompletion = (itemId: string) => {
    setCompletedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isItemCompleted = (itemId: string) => {
    return completedItems.has(itemId);
  };

  const getProgressStats = () => {
    if (!pathway) return { completed: 0, total: 0, percentage: 0 };

    let total = 0;
    let completed = 0;

    pathway.steps.forEach((step, stepIndex) => {
      // Count core goals
      step.core_goals.forEach((_, goalIndex) => {
        total++;
        if (isItemCompleted(`step-${stepIndex}-goal-${goalIndex}`)) completed++;
      });

      // Count topics
      step.topics.forEach((topic, topicIndex) => {
        total++;
        if (isItemCompleted(`step-${stepIndex}-topic-${topicIndex}`))
          completed++;

        // Count projects
        (topic.projects || []).forEach((_, projectIndex) => {
          total++;
          if (
            isItemCompleted(
              `step-${stepIndex}-topic-${topicIndex}-project-${projectIndex}`
            )
          )
            completed++;
        });
      });

      // Count milestone project
      total++;
      if (isItemCompleted(`step-${stepIndex}-milestone`)) completed++;
    });

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  // Function to save the current pathway
  const savePathway = async () => {
    if (!pathway || !session || !session.user) {
      setError("Unable to save pathway. Please try again.");
      return;
    }

    const token = session.user.id_token;
    if (!token) {
      setError(
        "Authentication token not available. Please try logging in again."
      );
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";

      // Calculate current progress
      const progressStats = getProgressStats();

      const pathwayData = {
        topic: pathway.topic,
        learning_pathway: pathway,
        progress: {
          completed_items: Array.from(completedItems),
          total_items: progressStats.total,
          percentage: progressStats.percentage,
        },
      };

      console.log("🔍 Save Debug Info:");
      console.log("Backend URL:", backendUrl);
      console.log("Full URL:", `${backendUrl}/save_learning_pathway`);
      console.log("Pathway Data:", pathwayData);
      console.log("Token exists:", !!token);
      console.log("Token:", token ? `${token.substring(0, 20)}...` : "null");

      const res = await fetch(`${backendUrl}/save_learning_pathway`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pathway_data: pathwayData }),
      });

      console.log("📡 Response Status:", res.status);

      let data;
      try {
        data = await res.json();
        console.log("📋 Response Data:", data);
      } catch (jsonError) {
        console.error("❌ Failed to parse JSON response:", jsonError);
        const text = await res.text();
        console.log("📄 Raw response:", text);
        throw new Error(
          `Server returned invalid JSON. Status: ${res.status}, Response: ${text}`
        );
      }

      if (!res.ok) {
        console.error("❌ HTTP Error:", res.status, data);
        throw new Error(
          data.detail ||
            data.error ||
            `HTTP ${res.status}: Failed to save learning pathway`
        );
      }

      if (!data.success) {
        console.error("❌ Backend Error:", data);
        throw new Error(data.error || "Backend reported failure");
      }

      setIsSaved(true);
      // Reset saved state after 3 seconds to allow saving again if needed
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: unknown) {
      console.error("Save pathway error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to save pathway";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // State
    searchTopic,
    setSearchTopic,
    loading,
    error,
    pathway,
    session,
    status,
    completedItems,
    isSaving,
    isSaved,

    // Actions
    handleSearchSubmit,
    handleExampleClick,
    fetchLearningPathway,
    savePathway,

    // Progress tracking
    toggleItemCompletion,
    isItemCompleted,
    getProgressStats,
  };
}
