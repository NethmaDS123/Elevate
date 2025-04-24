"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  FiAlertTriangle,
  FiEdit3,
  FiLoader,
  FiStar,
  FiCheckCircle,
  FiCpu,
  FiTrendingUp,
  FiSettings,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

interface Evaluation {
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
  resume_mention: {
    include: boolean;
    justification: string;
  };
}

const icons: Record<string, JSX.Element> = {
  innovation: <FiTrendingUp className="w-5 h-5 mr-2 text-blue-500" />,
  technical_complexity: <FiCpu className="w-5 h-5 mr-2 text-purple-500" />,
  completeness_feasibility: (
    <FiCheckCircle className="w-5 h-5 mr-2 text-green-500" />
  ),
  scalability_maintainability: (
    <FiSettings className="w-5 h-5 mr-2 text-yellow-500" />
  ),
  industry_relevance: <FiUsers className="w-5 h-5 mr-2 text-gray-500" />,
};

const colors: Record<string, string> = {
  innovation: "from-blue-400 to-blue-600",
  technical_complexity: "from-purple-400 to-purple-600",
  completeness_feasibility: "from-green-400 to-green-600",
  scalability_maintainability: "from-yellow-400 to-yellow-600",
  industry_relevance: "from-gray-400 to-gray-600",
};

export default function ProjectEvaluationPage() {
  const { data: session, status } = useSession();
  const [projectDescription, setProjectDescription] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setEvaluation(null);

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
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          "https://elevatebackend.onrender.com";
        const res = await fetch(`${backendUrl}/evaluate_project`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.id_token}`,
          },
          body: JSON.stringify({ project_description: projectDescription }),
        });
        const data = await res.json();
        if (res.ok) {
          setEvaluation(data.evaluation);
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
    [projectDescription, session]
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Please log in to access Project Evaluation.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header & Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AI Project Evaluator
            </h1>
            <p className="text-gray-600">
              Get a detailed, actionable evaluation of your software projects
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <label
                htmlFor="projectDescription"
                className="block text-lg font-semibold text-gray-800 mb-3 flex items-center"
              >
                <FiEdit3 className="mr-2 text-purple-600" />
                Project Description
              </label>
              <textarea
                id="projectDescription"
                className="w-full h-40 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Describe your project in detail..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center"
              >
                <FiAlertTriangle className="text-red-500 mr-3 text-xl" />
                <span className="text-red-600 font-medium">{error}</span>
              </motion.div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setProjectDescription("")}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md flex items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" /> Analyzing...
                  </>
                ) : (
                  <>
                    <FiStar className="mr-2" /> Evaluate
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {evaluation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Overall Score */}
              <div className="bg-white rounded-xl p-6 shadow flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Overall Score
                  </h2>
                  <p className="text-sm text-gray-500">
                    Based on five evaluation criteria
                  </p>
                </div>
                <div className="text-5xl font-bold text-purple-600">
                  {evaluation.overall_score}
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(evaluation.breakdown).map(
                  ([key, { score, analysis }]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-lg font-semibold text-gray-800">
                          {icons[key]}
                          {key
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </div>
                        <div className="text-lg font-bold">{score}</div>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors[key]}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {analysis}
                      </p>
                    </motion.div>
                  )
                )}
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ translateY: -2 }}
                  className="bg-green-50 p-6 rounded-xl shadow"
                >
                  <h3 className="flex items-center text-xl font-semibold text-green-700 mb-3">
                    <FiCheckCircle className="mr-2 text-green-500" />
                    Key Strengths
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  whileHover={{ translateY: -2 }}
                  className="bg-yellow-50 p-6 rounded-xl shadow"
                >
                  <h3 className="flex items-center text-xl font-semibold text-yellow-700 mb-3">
                    <FiAlertTriangle className="mr-2 text-yellow-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {evaluation.areas_for_improvement.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Resume Recommendation */}
              <motion.div
                whileHover={{ translateY: -2 }}
                className="bg-blue-50 p-6 rounded-xl shadow"
              >
                <h3 className="flex items-center text-xl font-semibold text-blue-700 mb-3">
                  <FiFileText className="mr-2 text-blue-500" />
                  Resume Recommendation
                </h3>
                <p className="text-gray-700">
                  {evaluation.resume_mention.include ? "✅ Include" : "⚠️ Skip"}{" "}
                  — {evaluation.resume_mention.justification}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
