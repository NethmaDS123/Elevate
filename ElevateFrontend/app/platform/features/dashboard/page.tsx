"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/components/SidebarContext";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiBook,
  FiFileText,
  FiCheckCircle,
  FiZap,
  FiBriefcase,
  FiCode,
  FiLayers,
  FiCalendar,
  FiUser,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";
import { RadialProgress } from "@/components/RadialProgress";
import Link from "next/link";

// Define the structure of the dashboard response
type DashboardResponse = {
  user: {
    name: string;
    featureUsage: Record<string, number>;
  };
  resumeHealth: {
    score: number;
    improvements: number;
    lastUsed: string | null;
  };
  learningPaths: Array<{ title: string; progress: number }>;
};

// Component to preview learning pathways
function LearningPathwaysPreview({
  paths,
}: {
  paths: Array<{ icon: React.ReactNode; title: string; progress: number }>;
}) {
  return (
    <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-50 transition-all hover:shadow-md group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-3 text-gray-800">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg text-white shadow-sm">
            <FiBook className="w-5 h-5" />
          </div>
          Learning Pathways
        </h2>
        <Link
          href="/platform/features/learning-paths"
          className="text-gray-500 flex items-center gap-1 group-hover:text-indigo-600 transition-colors text-sm"
        >
          View All
          <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <div className="space-y-4 mb-6">
        {paths.slice(0, 2).map((path, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.01 }}
            className="group relative p-4 bg-white rounded-lg border border-gray-50 hover:border-indigo-100 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 rounded-md text-indigo-600">
                  {path.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{path.title}</h3>
                  <div className="w-full bg-gray-50 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-indigo-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <Link
        href="/platform/features/learning-paths"
        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all text-sm font-medium shadow-sm"
      >
        Continue Learning
      </Link>
    </div>
  );
}

// Main dashboard page component
export default function DashboardPage() {
  const { data: session, status } = useSession(); // Get session data and status
  const { isOpen } = useSidebar(); // Get sidebar open state
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  ); // State for dashboard data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Static quick actions for the dashboard
  const staticQuickActions = [
    {
      icon: <FiZap />,
      title: "Project Ideas",
      link: "/platform/features/dashboard",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      icon: <FiCode />,
      title: "Leetcode",
      link: "/platform/features/dashboard",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
    },
    {
      icon: <FiBriefcase />,
      title: "Job Tracker",
      link: "/platform/features/dashboard",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
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
            <FiZap className="w-5 h-5 text-indigo-600" />
          ) : (
            <FiLayers className="w-5 h-5 text-indigo-600" />
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

  // Render loading state
  if (status === "loading" || loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <FiLoader className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }
  // Render if user is not logged in
  if (!session) {
    return (
      <div className="p-8 text-gray-700">
        Please log in to view your dashboard.
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }
  // Render if no dashboard data is available
  if (!dashboardData) {
    return <div className="p-8">No data available.</div>;
  }

  // Render the main dashboard content
  return (
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="p-8 min-h-screen bg-gray-50/50"
    >
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-gray-900"
        >
          Welcome Back, {dashboardData.user.name}
        </motion.h1>
        <p className="text-gray-500 mt-2 text-base">
          Your career progress summary
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-3 text-gray-800">
                <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg text-white shadow-sm">
                  <FiFileText className="w-5 h-5" />
                </div>
                Resume ATS Score
              </h2>
              <RadialProgress
                value={dashboardData.resumeHealth.score}
                trackColor="text-gray-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-indigo-600 w-6 h-6" />
                  <div>
                    <div className="text-sm text-gray-600">Current Score</div>
                    <div className="text-xl font-semibold text-indigo-700">
                      {dashboardData.resumeHealth.score}%
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="text-gray-600 w-6 h-6" />
                  <div>
                    <div className="text-sm text-gray-600">Improvements</div>
                    <div className="text-xl font-semibold text-gray-800">
                      {dashboardData.resumeHealth.improvements}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/platform/features/resume-optimizer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all text-sm font-medium shadow-sm"
            >
              Optimize Resume Now
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-3 text-gray-800">
              <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg text-white shadow-sm">
                <FiZap className="w-5 h-5" />
              </div>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {staticQuickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="group relative"
                >
                  <Link
                    href={action.link}
                    className={`p-3 rounded-lg flex items-center gap-3 ${
                      action.bgColor
                    } hover:bg-opacity-50 transition-all border border-transparent hover:border-${
                      action.textColor.split("-")[1]
                    }-100`}
                  >
                    <div className={`p-1.5 rounded-md ${action.textColor}`}>
                      {React.cloneElement(action.icon, {
                        className: "w-5 h-5",
                      })}
                    </div>
                    <span className={`text-sm font-medium ${action.textColor}`}>
                      {action.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <LearningPathwaysPreview
            paths={dashboardData.learningPaths.map((p) => ({
              ...p,
              icon: p.title.toLowerCase().includes("cloud") ? (
                <FiZap className="w-5 h-5 text-indigo-600" />
              ) : (
                <FiLayers className="w-5 h-5 text-indigo-600" />
              ),
            }))}
          />

          <div className="md:col-span-1 bg-gradient-to-br from-gray-900 to-indigo-900 text-white rounded-xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-3 relative">
              <div className="p-2.5 bg-white/10 rounded-md backdrop-blur-sm">
                <FiCalendar className="w-5 h-5" />
              </div>
              Interview Prep
            </h2>
            <Link
              href="/platform/features/interview-prep"
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all text-sm font-medium"
            >
              Start Practice
            </Link>
          </div>
        </div>

        <div className="xl:w-80 bg-white rounded-xl p-6 shadow-sm border border-gray-50 h-fit">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg text-white shadow-sm">
              <FiUser className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {dashboardData.user.name}
            </h2>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feature Activity
            </h3>
            <div className="space-y-3">
              {Object.entries(dashboardData.user.featureUsage).map(
                ([feature, count]) => (
                  <motion.div
                    key={feature}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-100 transition-all"
                  >
                    <span className="text-sm text-gray-700 font-medium capitalize">
                      {feature.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 bg-white px-2 py-1 rounded-md shadow-xs">
                      {count}
                    </span>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
