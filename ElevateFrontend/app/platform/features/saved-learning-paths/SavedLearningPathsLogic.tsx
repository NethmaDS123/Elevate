"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// ------------------
// Type Definitions (reusing from learning-paths)
// ------------------

interface Project {
  name: string;
  description: string;
  difficulty: string;
  estimated_time: string;
  technologies?: string[];
}

interface Topic {
  name: string;
  description: string;
  estimated_time: string;
  resources: { type: string; title: string; url?: string; description?: string; }[];
  projects?: Project[];
}

interface Step {
  step?: number;
  title: string;
  description?: string;
  duration: string;
  skill_level?: "Beginner" | "Intermediate" | "Advanced";
  core_goals: string[];
  learning_outcomes?: string[];
  topics: Topic[];
  milestone_project?: {
    name: string;
    description: string;
    requirements: string[];
  };
  assessment_ideas?: string[];
}

export interface LearningPathway {
  title: string;
  description: string;
  total_duration: string;
  difficulty_level: string;
  prerequisites: string[];
  learning_outcomes: string[];
  steps?: Step[];
  topic?: string;
  timeline?: string;
  overview?: string;
  career_outcomes?: string[];
}

interface ProgressData {
  completed_items: string[];
  total_items: number;
  percentage: number;
  last_accessed?: string;
}

export interface SavedPathway {
  entry_id: string;
  pathway_id: string;
  topic: string;
  learning_pathway: LearningPathway;
  progress: {
    completed_items: string[];
    total_items: number;
    percentage: number;
    last_accessed: string;
  };
  saved_at: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// ------------------
// Custom Hook
// ------------------

export function useSavedLearningPaths() {
  const { data: session, status } = useSession();
  const [savedPathways, setSavedPathways] = useState<SavedPathway[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null);

  // Progress tracking - we'll track progress per pathway
  const [completedItems, setCompletedItems] = useState<
    Map<string, Set<string>>
  >(new Map());

  // Function to fetch saved learning pathways
  const fetchSavedPathways = async () => {
    if (!session || !session.user) {
      setError("You must be logged in to view saved pathways.");
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
    setError("");

    try {
      console.log("🔧 Environment check (Saved Pathways):");
      console.log(
        "NEXT_PUBLIC_BACKEND_URL:",
        process.env.NEXT_PUBLIC_BACKEND_URL
      );

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";

      console.log("🔍 Fetch Saved Pathways Debug:");
      console.log("Backend URL:", backendUrl);
      console.log("Token exists:", !!token);

      const res = await fetch(`${backendUrl}/saved_learning_pathways`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
            `HTTP ${res.status}: Failed to fetch saved pathways`
        );
      }

      if (!data.success) {
        console.error("❌ Backend Error:", data);
        throw new Error(data.error || "Backend reported failure");
      }

      setSavedPathways(data.pathways || []);

      // Initialize progress tracking for each pathway
      const newCompletedItems = new Map();
      data.pathways.forEach((pathway: SavedPathway) => {
        const pathwayItems = new Set(pathway.progress?.completed_items || []);
        newCompletedItems.set(pathway.pathway_id, pathwayItems);
      });
      setCompletedItems(newCompletedItems);
    } catch (err: unknown) {
      console.error("Fetch saved pathways error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to fetch saved pathways";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a saved pathway
  const deletePathway = async (pathwayId: string) => {
    if (!session || !session.user) {
      setError("You must be logged in to delete pathways.");
      return;
    }

    const token = session.user.id_token;
    if (!token) {
      setError(
        "Authentication token not available. Please try logging in again."
      );
      return;
    }

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";

      const res = await fetch(
        `${backendUrl}/delete_saved_pathway/${pathwayId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete pathway");
      }

      // Remove from local state
      setSavedPathways((prev) =>
        prev.filter((p) => p.pathway_id !== pathwayId)
      );

      // Remove from completed items tracking
      setCompletedItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(pathwayId);
        return newMap;
      });
    } catch (err: unknown) {
      console.error("Delete pathway error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to delete pathway";
      setError(message);
    }
  };

  // Function to update progress for a pathway
  const updateProgress = async (
    pathwayId: string,
    progressData: ProgressData
  ) => {
    if (!session || !session.user) {
      return;
    }

    const token = session.user.id_token;
    if (!token) {
      return;
    }

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";

      console.log("🔄 Updating progress:", { pathwayId, progressData });

      const res = await fetch(
        `${backendUrl}/update_pathway_progress/${pathwayId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ progress_data: progressData }),
        }
      );

      const data = await res.json();
      console.log("📡 Progress update response:", { status: res.status, data });

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update progress");
      }

      // Update local state
      setSavedPathways((prev) =>
        prev.map((pathway) =>
          pathway.pathway_id === pathwayId
            ? { ...pathway, progress: { ...pathway.progress, ...progressData } }
            : pathway
        )
      );
    } catch (err: unknown) {
      console.error("Update progress error:", err);
    }
  };

  // Progress tracking functions for a specific pathway
  const toggleItemCompletion = (pathwayId: string, itemId: string) => {
    console.log("🔄 Toggling item completion:", { pathwayId, itemId });

    setCompletedItems((prev) => {
      const newMap = new Map(prev);
      const pathwayItems = newMap.get(pathwayId) || new Set();

      const wasCompleted = pathwayItems.has(itemId);
      if (wasCompleted) {
        pathwayItems.delete(itemId);
        console.log("✅ Unmarked item as completed");
      } else {
        pathwayItems.add(itemId);
        console.log("✅ Marked item as completed");
      }

      newMap.set(pathwayId, pathwayItems);

      // Update progress in backend
      const pathway = savedPathways.find((p) => p.pathway_id === pathwayId);
      if (pathway) {
        const stats = getProgressStats(pathwayId, pathway.learning_pathway);
        updateProgress(pathwayId, {
          completed_items: Array.from(pathwayItems),
          total_items: stats.total,
          percentage: stats.percentage,
        });
      }

      return newMap;
    });
  };

  const isItemCompleted = (pathwayId: string, itemId: string) => {
    const pathwayItems = completedItems.get(pathwayId) || new Set();
    return pathwayItems.has(itemId);
  };

  const getProgressStats = (pathwayId: string, pathway?: LearningPathway) => {
    const pathwayItems = completedItems.get(pathwayId) || new Set();

    if (!pathway) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    let total = 0;
    let completed = 0;

    // Count based on pathway structure (same logic as original)
    if (pathway.steps) {
      pathway.steps.forEach((step: Step, stepIndex: number) => {
        // Count core goals
        step.core_goals?.forEach((_: string, goalIndex: number) => {
          total++;
          if (pathwayItems.has(`step-${stepIndex}-goal-${goalIndex}`))
            completed++;
        });

        // Count topics
        step.topics?.forEach((topic: Topic, topicIndex: number) => {
          total++;
          if (pathwayItems.has(`step-${stepIndex}-topic-${topicIndex}`))
            completed++;

          // Count projects
          topic.projects?.forEach((_: Project, projectIndex: number) => {
            total++;
            if (
              pathwayItems.has(
                `step-${stepIndex}-topic-${topicIndex}-project-${projectIndex}`
              )
            )
              completed++;
          });
        });

        // Count milestone project
        total++;
        if (pathwayItems.has(`step-${stepIndex}-milestone`)) completed++;
      });
    }

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  // Fetch saved pathways on component mount
  useEffect(() => {
    if (session && session.user) {
      fetchSavedPathways();
    }
  }, [session, fetchSavedPathways]);

  return {
    // State
    savedPathways,
    loading,
    error,
    session,
    status,
    expandedPathway,
    setExpandedPathway,
    completedItems,

    // Actions
    fetchSavedPathways,
    deletePathway,
    updateProgress,

    // Progress tracking
    toggleItemCompletion,
    isItemCompleted,
    getProgressStats,
  };
}
