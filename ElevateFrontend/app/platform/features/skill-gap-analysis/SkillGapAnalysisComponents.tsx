"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLoader,
  FiStar,
  FiTrendingUp,
  FiTarget,
  FiThumbsUp,
  FiAlertTriangle,
  FiZap,
  FiBookOpen,
  FiActivity,
  FiCheckCircle,
  FiArrowRight,
  FiBarChart,
  FiAward,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { AnalysisData } from "./SkillGapAnalysisLogic";

// ===================================
// STATE COMPONENTS (LOADING, ERROR, ETC.)
// ===================================

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <div className="flex items-center gap-3">
        <FiLoader className="animate-spin h-8 w-8 text-[#8B5CF6]" />
        <span className="text-lg text-gray-300">
          Loading skill gap analysis...
        </span>
      </div>
    </div>
  );
}

export function UnauthenticatedState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <p className="text-lg font-medium text-gray-300">
        Please log in to access skill gap analysis.
      </p>
    </div>
  );
}

// Component for analysis section
export function AnalysisSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#161616] rounded-lg p-6 shadow-sm border border-[#2A2A2A]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#252525] rounded-lg text-[#8B5CF6]">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Header Component
export function SkillGapHeader() {
  return (
    <header className="text-center mb-12 relative">
      {/* Floating elements for visual interest */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/4 w-16 h-16 bg-[#8B5CF6]/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-10 right-1/4 w-12 h-12 bg-[#22C55E]/10 rounded-full blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center justify-center gap-3"
        >
          <FiTrendingUp className="text-[#8B5CF6]" />
          Skill Gap Analysis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed"
        >
          Get detailed insights on your skill gaps and receive a strategic
          roadmap for career advancement
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-5"
        >
          <div className="flex items-center gap-2 text-gray-400">
            <div className="p-1.5 bg-[#8B5CF6]/20 rounded-lg">
              <FiTarget className="w-3.5 h-3.5 text-[#8B5CF6]" />
            </div>
            <span className="text-xs">Gap Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="p-1.5 bg-[#22C55E]/20 rounded-lg">
              <FiBarChart className="w-3.5 h-3.5 text-[#22C55E]" />
            </div>
            <span className="text-xs">Strategic Roadmap</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="p-1.5 bg-[#F97316]/20 rounded-lg">
              <FiAward className="w-3.5 h-3.5 text-[#F97316]" />
            </div>
            <span className="text-xs">Career Advancement</span>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}

// Input Form Component
export function SkillGapForm({
  roleLevel,
  setRoleLevel,
  domain,
  setDomain,
  resumeText,
  setResumeText,
  loading,
  error,
  handleSubmit,
}: {
  roleLevel: string;
  setRoleLevel: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  resumeText: string;
  setResumeText: (value: string) => void;
  loading: boolean;
  error: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#161616] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 border border-[#2A2A2A] mb-8 relative overflow-hidden"
    >
      {/* Background texture and subtle gradient */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Role Level Selection */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium text-sm">
              Target Role Level
            </label>
            <select
              className="w-full p-4 bg-[#252525] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#8B5CF6]/50 text-gray-200"
              value={roleLevel}
              onChange={(e) => setRoleLevel(e.target.value)}
              disabled={loading}
            >
              <option value="internship">Internship</option>
              <option value="junior">Junior Engineer</option>
              <option value="mid">Mid-level Engineer</option>
              <option value="senior">Senior Engineer</option>
              <option value="staff">Staff Engineer</option>
            </select>
          </div>

          {/* Domain Input */}
          <div className="space-y-2">
            <label className="text-gray-300 font-medium text-sm">
              Domain/Field
            </label>
            <input
              type="text"
              placeholder="e.g., Software Engineering, Data Science"
              className="w-full p-4 bg-[#252525] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#8B5CF6]/50 text-gray-200 placeholder-gray-500"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Resume Text Input */}
        <div className="space-y-2">
          <label className="text-gray-300 font-medium text-sm">
            Resume Content
          </label>
          <textarea
            placeholder="Paste your resume content here..."
            className="w-full p-4 bg-[#252525] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#8B5CF6]/50 resize-none h-48 text-gray-200 placeholder-gray-500"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8B5CF6] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#7C3AED] transition flex items-center justify-center gap-2 relative z-10 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin h-5 w-5" />
              Analyzing Skills...
            </>
          ) : (
            <>
              <FiStar className="h-5 w-5" />
              Run Elite Analysis
            </>
          )}
        </button>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-800/30"
          >
            {error}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}

// Strengths Display Component
export function StrengthsDisplay({
  strengths,
}: {
  strengths: { skill: string; reasoning: string }[];
}) {
  return (
    <AnalysisSection title="Your Strengths" icon={<FiThumbsUp />}>
      <div className="space-y-4">
        {strengths.map((strength, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 bg-green-900/20 rounded-lg border border-green-800/30"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <FiCheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-green-400 mb-2">
                  {strength.skill}
                </h4>
                <p className="text-sm text-green-300">{strength.reasoning}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnalysisSection>
  );
}

// Areas for Improvement Component
export function ImprovementAreasDisplay({
  areas,
}: {
  areas: {
    category: string;
    current_situation: string;
    ideal_situation: string;
    urgency: string;
    reasoning: string;
  }[];
}) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "text-red-400 bg-red-900/20 border-red-800/30";
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-800/30";
      case "low":
        return "text-blue-400 bg-blue-900/20 border-blue-800/30";
      default:
        return "text-gray-400 bg-gray-900/20 border-gray-800/30";
    }
  };

  return (
    <AnalysisSection title="Areas for Improvement" icon={<FiAlertTriangle />}>
      <div className="space-y-4">
        {areas.map((area, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-lg border ${getUrgencyColor(area.urgency)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <FiTarget className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{area.category}</h4>
                  <span className="text-xs px-2 py-1 rounded-full border">
                    {area.urgency} Priority
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Current:</span>{" "}
                    {area.current_situation}
                  </div>
                  <div>
                    <span className="font-medium">Ideal:</span>{" "}
                    {area.ideal_situation}
                  </div>
                  <div className="pt-2 border-t border-current/20">
                    {area.reasoning}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnalysisSection>
  );
}

// Strategic Roadmap Component
export function StrategicRoadmapDisplay({
  roadmap,
}: {
  roadmap: {
    short_term_goals: any[];
    medium_term_goals: any[];
    long_term_goals: any[];
  };
}) {
  const phases = [
    {
      key: "short_term_goals",
      title: "Short Term Goals",
      icon: <FiClock />,
      color: "text-green-400",
    },
    {
      key: "medium_term_goals",
      title: "Medium Term Goals",
      icon: <FiTarget />,
      color: "text-yellow-400",
    },
    {
      key: "long_term_goals",
      title: "Long Term Goals",
      icon: <FiAward />,
      color: "text-blue-400",
    },
  ];

  return (
    <AnalysisSection title="Strategic Career Roadmap" icon={<FiBarChart />}>
      <div className="space-y-6">
        {phases.map((phase, phaseIdx) => {
          const items = roadmap[phase.key as keyof typeof roadmap] ?? [];

          return (
            <motion.div
              key={phase.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: phaseIdx * 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-[#252525] rounded-lg ${phase.color}`}>
                  {phase.icon}
                </div>
                <h4 className="text-lg font-semibold text-white">
                  {phase.title}
                </h4>
              </div>

              <div className="space-y-3 ml-11">
                {items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#252525] rounded-lg border border-[#2A2A2A]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white">{item.goal}</h5>
                      <span className="text-xs text-gray-400 px-2 py-1 bg-[#1A1A1A] rounded">
                        {item.timeframe}
                      </span>
                    </div>

                    <ul className="space-y-1 mb-3">
                      {item.actions.map((action: string, aIdx: number) => (
                        <li
                          key={aIdx}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <FiArrowRight className="w-3 h-3 mt-1 text-[#8B5CF6] flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>

                    <p className="text-sm text-gray-400 italic border-t border-[#2A2A2A] pt-2">
                      {item.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </AnalysisSection>
  );
}

// Resume Improvements Component
export function ResumeImprovementsDisplay({
  improvements,
}: {
  improvements: {
    section: string;
    original: string;
    improved: string;
  }[];
}) {
  return (
    <AnalysisSection title="Resume Improvement Examples" icon={<FiFileText />}>
      <div className="space-y-4">
        {improvements.map((improvement, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 bg-[#252525] rounded-lg border border-[#2A2A2A]"
          >
            <h4 className="font-semibold text-[#8B5CF6] mb-3">
              {improvement.section}
            </h4>

            <div className="space-y-3">
              <div className="p-3 bg-red-900/20 rounded border border-red-800/30">
                <span className="text-red-400 font-medium text-sm">
                  Original:
                </span>
                <p className="text-red-300 text-sm mt-1">
                  {improvement.original}
                </p>
              </div>

              <div className="p-3 bg-green-900/20 rounded border border-green-800/30">
                <span className="text-green-400 font-medium text-sm">
                  Improved:
                </span>
                <p className="text-green-300 text-sm mt-1">
                  {improvement.improved}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnalysisSection>
  );
}

// Main UI Component
export function SkillGapAnalysisUI({
  isOpen,
  roleLevel,
  setRoleLevel,
  domain,
  setDomain,
  resumeText,
  setResumeText,
  analysis,
  loading,
  error,
  activeTab,
  setActiveTab,
  handleSubmit,
}: {
  isOpen: boolean;
  roleLevel: string;
  setRoleLevel: (value: string) => void;
  domain: string;
  setDomain: (value: string) => void;
  resumeText: string;
  setResumeText: (value: string) => void;
  analysis: AnalysisData | null;
  loading: boolean;
  error: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="p-8 min-h-screen bg-[#1A1A1A] relative"
    >
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full filter blur-3xl opacity-30"></div>

      <div className="max-w-5xl mx-auto">
        <SkillGapHeader />

        <SkillGapForm
          roleLevel={roleLevel}
          setRoleLevel={setRoleLevel}
          domain={domain}
          setDomain={setDomain}
          resumeText={resumeText}
          setResumeText={setResumeText}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
        />

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#161616] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 border border-[#2A2A2A] relative overflow-hidden"
            >
              {/* Background texture */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-4 mb-8 border-b border-[#2A2A2A] pb-4 relative">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === "overview"
                      ? "bg-[#252525] text-[#8B5CF6]"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <FiActivity className="w-4 h-4" />
                  Gap Analysis
                </button>
                <button
                  onClick={() => setActiveTab("roadmap")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === "roadmap"
                      ? "bg-[#252525] text-[#8B5CF6]"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <FiBarChart className="w-4 h-4" />
                  Strategic Roadmap
                </button>
                <button
                  onClick={() => setActiveTab("resume")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    activeTab === "resume"
                      ? "bg-[#252525] text-[#8B5CF6]"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <FiFileText className="w-4 h-4" />
                  Resume Tips
                </button>
              </div>

              {/* Tab Content */}
              <div className="relative">
                {activeTab === "overview" && (
                  <div className="grid gap-6">
                    <StrengthsDisplay
                      strengths={analysis.detailed_gap_analysis.strengths}
                    />
                    <ImprovementAreasDisplay
                      areas={
                        analysis.detailed_gap_analysis.areas_for_improvement
                      }
                    />
                  </div>
                )}

                {activeTab === "roadmap" && (
                  <StrategicRoadmapDisplay
                    roadmap={analysis.strategic_roadmap}
                  />
                )}

                {activeTab === "resume" && (
                  <ResumeImprovementsDisplay
                    improvements={analysis.resume_improvements}
                  />
                )}
              </div>

              {/* Benchmark Sources */}
              <div className="mt-8 pt-6 border-t border-[#2A2A2A] text-center">
                <p className="text-sm text-gray-400">
                  <span className="font-medium">Benchmark Sources:</span>{" "}
                  {analysis.metadata.benchmark_sources.join(", ")}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
