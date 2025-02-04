"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiEdit3,
  FiLoader,
  FiStar,
  FiShield,
  FiDatabase,
  FiZap,
  FiCalendar,
} from "react-icons/fi";

function parseEvaluation(evaluation: string): Record<string, string> {
  const lines = evaluation.split("\n").filter((line) => line.trim() !== "");
  const result: Record<string, string> = {};
  lines.forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts.shift()?.trim();
      const value = parts.join(":").trim();
      if (key) result[key] = value;
    }
  });
  return result;
}

const getSectionIcon = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("security"))
    return <FiShield className="w-5 h-5 mr-2" />;
  if (lowerKey.includes("technology"))
    return <FiDatabase className="w-5 h-5 mr-2" />;
  if (lowerKey.includes("reliability"))
    return <FiZap className="w-5 h-5 mr-2" />;
  if (lowerKey.includes("integration"))
    return <FiCalendar className="w-5 h-5 mr-2" />;
  return <FiStar className="w-5 h-5 mr-2" />;
};

const getSectionColor = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("security")) return "border-yellow-400 bg-yellow-50";
  if (lowerKey.includes("technology")) return "border-purple-400 bg-purple-50";
  if (lowerKey.includes("reliability")) return "border-green-400 bg-green-50";
  if (lowerKey.includes("integration")) return "border-blue-400 bg-blue-50";
  return "border-gray-200 bg-white";
};

export default function ProjectEvaluationPage() {
  const [projectDescription, setProjectDescription] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEvaluation("");

    if (!projectDescription.trim()) {
      setError("Project description is required.");
      return;
    }

    setLoading(true);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${backendUrl}/evaluate_project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_description: projectDescription }),
      });

      const data = await res.json();

      if (res.ok) {
        setEvaluation(
          data.evaluation.evaluation
            ? data.evaluation.evaluation
            : data.evaluation
        );
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error during evaluation:", err);
      setError("An error occurred while evaluating the project.");
    }
    setLoading(false);
  };

  const parsedOutput = evaluation ? parseEvaluation(evaluation) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 inline-block">
              Project Evaluation
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Get detailed feedback on your project&apos;s strengths and areas
              for improvement
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
              <label
                htmlFor="projectDescription"
                className="block text-lg font-semibold text-gray-800 mb-4 flex items-center"
              >
                <FiEdit3 className="mr-2 text-purple-600" />
                Project Description
              </label>
              <textarea
                id="projectDescription"
                className="w-full h-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                         text-gray-700 placeholder-gray-400 resize-none transition-all duration-200"
                placeholder="Describe your project in detail..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
              >
                <FiAlertTriangle className="text-red-500 mr-3 text-xl" />
                <span className="text-red-600 font-medium">{error}</span>
              </motion.div>
            )}

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setProjectDescription("")}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg 
                           hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Input
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 
                           text-white font-semibold rounded-lg shadow-md transform transition-all duration-200 
                           hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FiStar className="mr-2" />
                    Evaluate Project
                  </>
                )}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {evaluation && parsedOutput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 space-y-6"
              >
                {Object.entries(parsedOutput).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border-l-4 ${getSectionColor(
                      key
                    )} shadow-sm`}
                  >
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                          {getSectionIcon(key)}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {key}
                        </h3>
                        <div className="prose prose-sm text-gray-600">
                          {value.split("\n").map((line, i) => (
                            <p key={i} className="mb-2">
                              {line}
                            </p>
                          ))}
                        </div>
                        {key.toLowerCase().includes("technology") && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {value.split(", ").map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm shadow-sm"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        {key.toLowerCase().includes("reliability") && (
                          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: "99.9%" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
