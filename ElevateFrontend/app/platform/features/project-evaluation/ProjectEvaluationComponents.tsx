"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FiTarget,
  FiLayers,
  FiDollarSign,
  FiPlusCircle,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";
import { Evaluation, colors, iconColors } from "./ProjectEvaluationLogic";

// Define the props for the ProjectEvaluationUI component
interface ProjectEvaluationUIProps {
  projectDescription: string;
  setProjectDescription: (value: string) => void;
  evaluation: Evaluation | null;
  loading: boolean;
  error: string;
  handleSubmit: (e: React.FormEvent) => void;
}

// Map of icon components
const iconComponents: Record<string, JSX.Element> = {
  innovation: <FiTrendingUp className="w-5 h-5 mr-2" />,
  technical_complexity: <FiCpu className="w-5 h-5 mr-2" />,
  completeness_feasibility: <FiCheckCircle className="w-5 h-5 mr-2" />,
  scalability_maintainability: <FiSettings className="w-5 h-5 mr-2" />,
  industry_relevance: <FiUsers className="w-5 h-5 mr-2" />,
};

export function ProjectEvaluationUI({
  projectDescription,
  setProjectDescription,
  evaluation,
  loading,
  error,
  handleSubmit,
}: ProjectEvaluationUIProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full filter blur-3xl opacity-30"></div>

      <div className="max-w-3xl mx-auto space-y-12 relative z-10">
        {/* Header & Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              AI Project Evaluator
            </h1>
            <p className="text-gray-400">
              Get a detailed, actionable evaluation of your software projects
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#161616] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] p-6 overflow-hidden relative">
              {/* Background texture and subtle gradient */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

              <label
                htmlFor="projectDescription"
                className="block text-lg font-semibold text-white mb-3 flex items-center relative z-10"
              >
                <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#8B5CF6] mr-2">
                  <FiEdit3 className="w-5 h-5" />
                </div>
                Project Description
              </label>
              <textarea
                id="projectDescription"
                className="w-full h-40 px-4 py-2 bg-[#252525] border border-[#2A2A2A] text-white rounded-md focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent resize-none relative z-10"
                placeholder="Describe your project in detail..."
                defaultValue={projectDescription}
                onChange={(e) => {
                  console.log("Textarea value changed:", e.target.value);
                  setProjectDescription(e.target.value);
                }}
                autoComplete="off"
                spellCheck="false"
                ref={textareaRef}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-[#2A1A1A] border border-red-500/30 rounded-md flex items-center"
              >
                <FiAlertTriangle className="text-red-500 mr-3 text-xl" />
                <span className="text-red-400 font-medium">{error}</span>
              </motion.div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setProjectDescription("")}
                className="px-4 py-2 text-gray-400 hover:bg-[#252525] border border-[#2A2A2A] rounded-md transition-all"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-[#8B5CF6]/90 to-[#8B5CF6] text-white rounded-md flex items-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:translate-y-[-1px] transition-all"
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
              <div className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] flex items-center justify-between overflow-hidden relative">
                {/* Background texture and subtle gradient */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

                <div className="relative">
                  <h2 className="text-2xl font-semibold text-white">
                    Overall Score
                  </h2>
                  <p className="text-sm text-gray-400">
                    Based on five evaluation criteria
                  </p>
                </div>
                <div className="text-5xl font-bold text-[#8B5CF6] relative">
                  {evaluation.overall_score}
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(evaluation.breakdown).map(
                  ([key, { score, analysis }]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-[#161616] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] p-6 hover:border-[#8B5CF6]/30 transition-all overflow-hidden relative"
                    >
                      {/* Background texture and subtle gradient */}
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />

                      <div className="flex items-center justify-between mb-3 relative">
                        <div
                          className={`flex items-center text-lg font-semibold text-white`}
                        >
                          <div
                            className={`p-1.5 rounded-xl ${iconColors[key]}`}
                          >
                            {iconComponents[key]}
                          </div>
                          {key
                            .split("_")
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(" ")}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {score}
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-2 bg-[#333333] rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors[key]}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed relative">
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
                  className="bg-[#161616] p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] hover:border-[#22C55E]/30 transition-all overflow-hidden relative"
                >
                  {/* Background texture and subtle gradient */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full filter blur-3xl"></div>

                  <h3 className="flex items-center text-xl font-semibold text-white mb-3 relative">
                    <div className="p-2 bg-[#252525] rounded-xl text-[#22C55E] mr-2">
                      <FiCheckCircle className="w-5 h-5" />
                    </div>
                    Key Strengths
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 relative">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  whileHover={{ translateY: -2 }}
                  className="bg-[#161616] p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] hover:border-[#F97316]/30 transition-all overflow-hidden relative"
                >
                  {/* Background texture and subtle gradient */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/10 rounded-full filter blur-3xl"></div>

                  <h3 className="flex items-center text-xl font-semibold text-white mb-3 relative">
                    <div className="p-2 bg-[#252525] rounded-xl text-[#F97316] mr-2">
                      <FiAlertTriangle className="w-5 h-5" />
                    </div>
                    Areas for Improvement
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 relative">
                    {evaluation.areas_for_improvement.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Resume Recommendation */}
              <motion.div
                whileHover={{ translateY: -2 }}
                className="bg-[#161616] p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] hover:border-[#8B5CF6]/30 transition-all overflow-hidden relative"
              >
                {/* Background texture and subtle gradient */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

                <h3 className="flex items-center text-xl font-semibold text-white mb-3 relative">
                  <div className="p-2 bg-[#252525] rounded-xl text-[#8B5CF6] mr-2">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  Resume Recommendation
                </h3>
                <p className="text-gray-300 relative">
                  {evaluation.resume_mention.include ? "✅ Include" : "⚠️ Skip"}{" "}
                  — {evaluation.resume_mention.justification}
                </p>
              </motion.div>

              {/* Feature Ideas */}
              {evaluation.feature_ideas && (
                <motion.div
                  whileHover={{ translateY: -2 }}
                  className="bg-[#161616] p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] hover:border-[#8B5CF6]/30 transition-all overflow-hidden relative"
                >
                  {/* Background texture and subtle gradient */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

                  <h3 className="flex items-center text-xl font-semibold text-white mb-3 relative">
                    <div className="p-2 bg-[#252525] rounded-xl text-[#8B5CF6] mr-2">
                      <FiPlusCircle className="w-5 h-5" />
                    </div>
                    Feature Ideas
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 relative">
                    {evaluation.feature_ideas.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Scaling Suggestions */}
              {evaluation.scaling_suggestions && (
                <motion.div
                  whileHover={{ translateY: -2 }}
                  className="bg-[#161616] p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] hover:border-[#22C55E]/30 transition-all overflow-hidden relative"
                >
                  {/* Background texture and subtle gradient */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full filter blur-3xl"></div>

                  <h3 className="flex items-center text-xl font-semibold text-white mb-5 relative">
                    <div className="p-2 bg-[#252525] rounded-xl text-[#22C55E] mr-2">
                      <FiBarChart2 className="w-5 h-5" />
                    </div>
                    Scaling Suggestions
                  </h3>

                  <div className="space-y-6">
                    {/* Architecture */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                        <FiLayers className="mr-2 text-[#22C55E]" />{" "}
                        Architecture
                      </h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        {evaluation.scaling_suggestions.architecture.map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Performance */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                        <FiZap className="mr-2 text-[#22C55E]" /> Performance
                      </h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        {evaluation.scaling_suggestions.performance.map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* User Base */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                        <FiUsers className="mr-2 text-[#22C55E]" /> User Base
                      </h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        {evaluation.scaling_suggestions.user_base.map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Market Potential */}
              {evaluation.market_potential && (
                <motion.div
                  whileHover={{ translateY: -2 }}
                  className="bg-[#161616] p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] hover:border-[#F97316]/30 transition-all overflow-hidden relative"
                >
                  {/* Background texture and subtle gradient */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/10 rounded-full filter blur-3xl"></div>

                  <h3 className="flex items-center text-xl font-semibold text-white mb-5 relative">
                    <div className="p-2 bg-[#252525] rounded-xl text-[#F97316] mr-2">
                      <FiTarget className="w-5 h-5" />
                    </div>
                    Market Potential
                  </h3>

                  <div className="space-y-6">
                    {/* Target Audience */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                        <FiUsers className="mr-2 text-[#F97316]" /> Target
                        Audience
                      </h4>
                      <p className="text-gray-300 pl-6">
                        {evaluation.market_potential.target_audience}
                      </p>
                    </div>

                    {/* Competitive Advantage */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                        <FiTrendingUp className="mr-2 text-[#F97316]" />{" "}
                        Competitive Advantage
                      </h4>
                      <p className="text-gray-300 pl-6">
                        {evaluation.market_potential.competitive_advantage}
                      </p>
                    </div>

                    {/* Monetization Options */}
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                        <FiDollarSign className="mr-2 text-[#F97316]" />{" "}
                        Monetization Options
                      </h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        {evaluation.market_potential.monetization_options.map(
                          (option, i) => (
                            <li key={i}>{option}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
