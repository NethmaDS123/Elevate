"use client";
import { useSidebar } from "@/components/SidebarContext";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiBook,
  FiFileText,
  FiCheckCircle,
  FiZap,
  FiUsers,
  FiBriefcase,
  FiCode,
  FiLayers,
  FiCalendar,
} from "react-icons/fi";
import { RadialProgress } from "@/components/RadialProgress";
import Link from "next/link";

export default function DashboardPage() {
  const { isOpen } = useSidebar();

  // Sample data
  const dashboardData = {
    resumeHealth: {
      score: 78,
      improvements: 3,
      lastUpdated: "2 days ago",
    },
    jobTracker: {
      applied: 12,
      interviews: 3,
      upcoming: [
        { company: "Tech Corp", date: "2024-03-25", role: "Senior Developer" },
        {
          company: "StartUp Inc",
          date: "2024-03-28",
          role: "Full Stack Engineer",
        },
      ],
    },
    leetcodeTracker: {
      streak: 15,
      problemsSolved: 45,
      recentProblems: [
        { name: "Two Sum", difficulty: "Easy", date: "2024-03-20" },
        { name: "Merge Intervals", difficulty: "Medium", date: "2024-03-19" },
      ],
    },
    learningPaths: [
      { title: "System Design", progress: 65, icon: <FiLayers /> },
      { title: "Cloud Certification", progress: 80, icon: <FiZap /> },
    ],
    quickActions: [
      {
        icon: <FiZap />,
        title: "Project Ideas",
        color: "text-amber-600",
        link: "/project-ideas",
      },
      {
        icon: <FiCode />,
        title: "Leetcode",
        color: "text-indigo-600",
        link: "/leetcode-tracker",
      },
      {
        icon: <FiBriefcase />,
        title: "Job Tracker",
        color: "text-teal-600",
        link: "/job-tracker",
      },
    ],
  };

  return (
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="p-8 min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Career Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back! {dashboardData.jobTracker.applied} applications
          submitted this month
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Resume Health Card */}
        <Link
          href="/resume-optimizer"
          className="md:col-span-2 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2 text-gray-700">
              <FiFileText className="text-indigo-600 w-5 h-5" />
              Resume Health
            </h2>
            <RadialProgress value={dashboardData.resumeHealth.score} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-indigo-50 rounded-lg flex items-center gap-3">
              <FiCheckCircle className="text-indigo-600 w-5 h-5" />
              <div>
                <div className="text-xs text-gray-600">ATS Score</div>
                <div className="text-lg font-semibold">
                  {dashboardData.resumeHealth.score}%
                </div>
              </div>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg flex items-center gap-3">
              <FiAlertCircle className="text-rose-600 w-5 h-5" />
              <div>
                <div className="text-xs text-gray-600">Improvements</div>
                <div className="text-lg font-semibold">
                  {dashboardData.resumeHealth.improvements}
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg flex items-center gap-3">
              <FiCalendar className="text-gray-600 w-5 h-5" />
              <div>
                <div className="text-xs text-gray-600">Last Updated</div>
                <div className="text-lg font-semibold">
                  {dashboardData.resumeHealth.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Learning Matrix */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-700">
            <FiBook className="text-teal-600 w-5 h-5" />
            Learning Paths
          </h2>
          <div className="space-y-4">
            {dashboardData.learningPaths.map((path, index) => (
              <Link key={index} href="/learning-pathways" className="block">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">{path.icon}</span>
                      <span className="text-sm">{path.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {path.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${path.progress}%` }}
                      className="h-full bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Job Tracker */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-700">
            <FiBriefcase className="text-amber-600 w-5 h-5" />
            Job Tracker
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-center">
                <div className="text-xl font-semibold">
                  {dashboardData.jobTracker.applied}
                </div>
                <div className="text-xs text-gray-600">Applied</div>
              </div>
              <div className="p-2 bg-teal-50 rounded-lg text-center">
                <div className="text-xl font-semibold">
                  {dashboardData.jobTracker.interviews}
                </div>
                <div className="text-xs text-gray-600">Interviews</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg text-center">
                <div className="text-xl font-semibold">
                  {dashboardData.jobTracker.upcoming.length}
                </div>
                <div className="text-xs text-gray-600">Upcoming</div>
              </div>
            </div>
            <div className="space-y-3">
              {dashboardData.jobTracker.upcoming.map((job, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="text-sm font-medium">{job.company}</div>
                  <div className="text-xs text-gray-600">{job.role}</div>
                  <div className="text-xs text-indigo-600 mt-1">
                    {new Date(job.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leetcode Tracker */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-700">
            <FiCode className="text-purple-600 w-5 h-5" />
            Leetcode Progress
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-center">
                <div className="text-xl font-semibold">
                  {dashboardData.leetcodeTracker.streak}
                </div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
              <div className="p-2 bg-green-50 rounded-lg text-center">
                <div className="text-xl font-semibold">
                  {dashboardData.leetcodeTracker.problemsSolved}
                </div>
                <div className="text-xs text-gray-600">Solved</div>
              </div>
            </div>
            <div className="space-y-3">
              {dashboardData.leetcodeTracker.recentProblems.map(
                (problem, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-sm font-medium">{problem.name}</div>
                    <div className="flex justify-between text-xs mt-1">
                      <span
                        className={`font-medium ${
                          problem.difficulty === "Easy"
                            ? "text-green-600"
                            : problem.difficulty === "Medium"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="text-gray-600">
                        {new Date(problem.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-700">
            <FiZap className="text-rose-600 w-5 h-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {dashboardData.quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className={`p-3 rounded-lg flex flex-col items-center justify-center aspect-square hover:bg-gray-50 transition-colors border ${action.color} border-gray-200`}
              >
                <span className={`text-2xl mb-2 ${action.color}`}>
                  {action.icon}
                </span>
                <span className="text-sm text-gray-700">{action.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Interview Prep */}
        <div className="md:col-span-2 bg-indigo-600 text-white rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FiCalendar className="w-5 h-5" />
            Interview Preparation
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-xs mb-1">Upcoming Interviews</div>
              <div className="text-xl font-semibold">
                {dashboardData.jobTracker.upcoming.length}
              </div>
            </div>
            <Link
              href="/interview-prep"
              className="p-3 bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 flex flex-col items-center justify-center transition-colors"
            >
              <FiCheckCircle className="w-6 h-6 mb-2" />
              <span className="text-sm">Practice Now</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
