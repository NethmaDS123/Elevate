"use client";
import { useSidebar } from "@/components/SidebarContext";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiBook,
  FiCloud,
  FiDatabase,
  FiFileText,
  FiServer,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";

export default function DashboardPage() {
  const { isOpen } = useSidebar();

  // Sample data - could come from props or API
  const skillGaps = [
    { name: "Cloud Architecture", progress: 65 },
    { name: "Database Management", progress: 45 },
    { name: "Server Configuration", progress: 30 },
  ];

  const recommendations = [
    {
      icon: FiSettings,
      title: "Optimize Your Resume",
      description:
        "Upload your resume and get tailored recommendations to make it ATS-compatible and role-specific.",
      action: "Optimize Resume",
    },
    {
      icon: FiCheckCircle,
      title: "Complete Learning Paths",
      description:
        "Review your progress in learning new skills and complete courses to bridge gaps in knowledge.",
      action: "View Learning Paths",
    },
  ];

  return (
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, Nethma!
          </h1>
          <p className="text-gray-600">Here&apos;s your current progress</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FiAlertCircle className="w-6 h-6 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              3
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Resume Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <FiFileText className="text-blue-600" />
            Resume Score
          </h2>
          <div className="relative w-full aspect-square max-w-[160px] mx-auto mb-4">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-current text-gray-200"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-current text-blue-600"
                strokeWidth="8"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset="283"
                style={{
                  strokeDashoffset: 283 * (1 - 0.78),
                  filter: "drop-shadow(0 4px 12px rgba(79, 156, 249, 0.3))",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">78%</span>
              <span className="text-sm text-gray-500">ATS Compatible</span>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:scale-[1.02] transition-transform font-medium shadow-md">
            Optimize Resume
          </button>
        </motion.div>

        {/* Skill Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all md:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <FiAlertCircle className="text-red-500" />
            Skill Gap Analysis
          </h2>
          <div className="space-y-6">
            {skillGaps.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-700">
                    {index === 0 && <FiCloud className="w-5 h-5" />}
                    {index === 1 && <FiDatabase className="w-5 h-5" />}
                    {index === 2 && <FiServer className="w-5 h-5" />}
                    <span>{skill.name}</span>
                  </div>
                  <span className="text-sm text-red-500 font-medium">
                    {100 - skill.progress}% missing
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition-colors font-medium">
            View All Gaps
          </button>
        </motion.div>

        {/* Recommendations Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all md:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Recommendations
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-xl flex items-center gap-4 hover:bg-gray-200 transition-all"
              >
                <div className="text-3xl text-gray-700">{<rec.icon />}</div>
                <div>
                  <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
                <button className="ml-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  {rec.action}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all lg:col-span-2"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <FiBook className="text-green-500" />
            Learning Progress
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600 mb-1">3</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">5</div>
              <div className="text-sm text-gray-600">New Paths</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
