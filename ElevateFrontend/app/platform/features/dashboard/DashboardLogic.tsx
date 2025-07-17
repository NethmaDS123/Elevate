"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/components/SidebarContext";
import { FiZap, FiCode, FiBriefcase, FiLayers } from "react-icons/fi";
import { ReactNode } from "react";

// Define the structure of the dashboard response
export type DashboardResponse = {
  user: {
    name: string;
    featureUsage: Record<string, number>;
  };
  resumeHealth: {
    score: number;
    improvements: number;
    lastUsed: string | null;
  };
  learningPaths: Array<{
    title: string;
    progress: number;
    icon?: ReactNode;
  }>;
};

// Define the quick actions type
export type QuickAction = {
  icon: ReactNode;
  title: string;
  link: string;
  bgColor: string;
  textColor: string;
};

export function useDashboardData() {
  const { data: session, status } = useSession(); // Get session data and status
  const { isOpen } = useSidebar(); // Get sidebar open state
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  ); // State for dashboard data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Static quick actions for the dashboard
  const staticQuickActions: QuickAction[] = [
    {
      icon: <FiZap />,
      title: "Project Ideas",
      link: "/platform/features/dashboard",
      bgColor: "bg-[#252525]",
      textColor: "text-[#22C55E]",
    },
    {
      icon: <FiCode />,
      title: "Leetcode",
      link: "/platform/features/dashboard",
      bgColor: "bg-[#252525]",
      textColor: "text-[#8B5CF6]",
    },
    {
      icon: <FiBriefcase />,
      title: "Job Tracker",
      link: "/platform/features/dashboard",
      bgColor: "bg-[#252525]",
      textColor: "text-[#F97316]",
    },
  ];

  // Effect to load dashboard data
  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setError(null);
      const backend =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";
      try {
        const resp = await fetch(`${backend}/dashboard`, {
          headers: { Authorization: `Bearer ${session!.user.id_token}` },
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const json: DashboardResponse = await resp.json();

        // Map learning paths to include icons
        const mappedLP = json.learningPaths.map((p) => ({
          ...p,
          icon: p.title.toLowerCase().includes("cloud") ? (
            <FiZap className="w-5 h-5 text-[#8B5CF6]" />
          ) : (
            <FiLayers className="w-5 h-5 text-[#8B5CF6]" />
          ),
        }));

        setDashboardData({
          ...json,
          learningPaths: mappedLP,
        });
      } catch (e) {
        console.error("Dashboard fetch error:", e);
        setError("Failed to fetch dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status, session]);

  return {
    dashboardData,
    loading,
    error,
    isOpen,
    session,
    status,
    staticQuickActions,
  };
}
