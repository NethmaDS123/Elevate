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
} from "react-icons/fi";

// Parse AI-generated evaluation into structured data
function parseEvaluation(evaluation: string): Record<string, string> {
  const sections = evaluation.split("\n").filter((line) => line.trim() !== "");
  const result: Record<string, string> = {};
  let currentKey = "";
  sections.forEach((line) => {
    if (line.includes(":")) {
      const [key, ...rest] = line.split(":");
      currentKey = key.trim();
      result[currentKey] = rest.join(":").trim();
    } else if (currentKey) {
      result[currentKey] += `\n${line.trim()}`;
    }
  });
  return result;
}

// Icons for evaluation categories
const getSectionIcon = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("innovation"))
    return <FiTrendingUp className="w-5 h-5 mr-2 text-blue-500" />;
  if (lowerKey.includes("technical"))
    return <FiCpu className="w-5 h-5 mr-2 text-purple-500" />;
  if (lowerKey.includes("feasibility"))
    return <FiCheckCircle className="w-5 h-5 mr-2 text-green-500" />;
  if (lowerKey.includes("scalability"))
    return <FiSettings className="w-5 h-5 mr-2 text-yellow-500" />;
  if (lowerKey.includes("industry"))
    return <FiUsers className="w-5 h-5 mr-2 text-gray-500" />;
  return <FiStar className="w-5 h-5 mr-2 text-gray-400" />;
};

// Color themes based on category
const getSectionColor = (key: string) => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("innovation")) return "border-blue-400 bg-blue-50";
  if (lowerKey.includes("technical")) return "border-purple-400 bg-purple-50";
  if (lowerKey.includes("feasibility")) return "border-green-400 bg-green-50";
  if (lowerKey.includes("scalability")) return "border-yellow-400 bg-yellow-50";
  if (lowerKey.includes("industry")) return "border-gray-400 bg-gray-50";
  return "border-gray-200 bg-white";
};

export default function ProjectEvaluationPage() {
  const { data: session, status } = useSession();
  const [projectDescription, setProjectDescription] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setEvaluation("");

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
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
          // Assuming that the API returns an object that might look like:
          // { evaluation: { evaluation: "<analysis text>" } }
          setEvaluation(data.evaluation?.evaluation || data.evaluation);
        } else {
          setError(data.error || "Something went wrong.");
        }
      } catch (err) {
        console.error("Error during evaluation:", err);
        setError("An error occurred while evaluating the project.");
      } finally {
        setLoading(false);
      }
    },
    [projectDescription, session]
  );

  const parsedOutput = evaluation ? parseEvaluation(evaluation) : null;

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
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text inline-block">
              AI Project Evaluator
            </h1>
            <p className="text-lg text-gray-600">
              AI-powered feedback on your project&apos;s strengths and areas for
              improvement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl">
              <label
                htmlFor="projectDescription"
                className="block text-lg font-semibold text-gray-800 mb-4 flex items-center"
              >
                <FiEdit3 className="mr-2 text-purple-600" />
                Project Description
              </label>
              <textarea
                id="projectDescription"
                className="w-full h-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
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

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setProjectDescription("")}
                className="px-5 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                Clear Input
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" /> Analyzing...
                  </>
                ) : (
                  <>
                    <FiStar className="mr-2" /> Evaluate Project
                  </>
                )}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {evaluation && parsedOutput && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {Object.entries(parsedOutput).map(([key, value]) => (
                  <motion.div
                    key={key}
                    className={`mt-6 p-6 rounded-xl border-l-4 ${getSectionColor(
                      key
                    )}`}
                  >
                    <h3 className="text-xl font-semibold flex items-center">
                      {getSectionIcon(key)} {key}
                    </h3>
                    <p className="text-gray-600">{value}</p>
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
