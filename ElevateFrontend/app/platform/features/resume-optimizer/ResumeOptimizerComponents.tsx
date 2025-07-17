"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  FiLoader,
  FiArrowRight,
  FiDownload,
  FiActivity,
  FiTarget,
  FiBookOpen,
  FiThumbsUp,
  FiAlertTriangle,
  FiZap,
  FiFileText,
  FiUpload,
  FiFile,
  FiX,
  FiUser,
} from "react-icons/fi";
import { RadialProgress } from "@/components/RadialProgress";
import { OptimizationResponse } from "./ResumeOptimizerLogic";

// ===================================
// STATE COMPONENTS (LOADING, ERROR, ETC.)
// ===================================

// Loading spinner component
export function LoadingState() {
  return (
    <div className="p-8 flex items-center justify-center bg-[#121212] rounded-lg">
      <FiLoader className="animate-spin h-8 w-8 text-[#8B5CF6]" />
    </div>
  );
}

// Error message component
export function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 text-red-400 bg-[#121212] rounded-lg">{message}</div>
  );
}

// Unauthenticated state component
export function UnauthenticatedState() {
  return (
    <div className="p-8 text-gray-300 bg-[#121212] rounded-lg">
      Please log in to use the Resume Optimizer.
    </div>
  );
}

// Component for progress bar
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-[#333333] rounded-full h-2.5">
      <div
        className="bg-gradient-to-r from-[#8B5CF6]/70 to-[#8B5CF6] h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
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

// File Upload Component
export function FileUploadArea({
  onFileUpload,
  resumeFile,
  isProcessingFile,
  clearResumeFile,
}: {
  onFileUpload: (file: File) => void;
  resumeFile: File | null;
  isProcessingFile: boolean;
  clearResumeFile: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    clearResumeFile();
  };

  return (
    <div className="mb-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all h-64
          ${
            resumeFile
              ? "border-[#8B5CF6]/50 bg-[#8B5CF6]/5"
              : "border-[#2A2A2A] hover:border-[#8B5CF6]/30 hover:bg-[#252525]"
          }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={isProcessingFile}
        />

        {isProcessingFile ? (
          <div className="flex flex-col items-center py-4">
            <FiLoader className="animate-spin h-10 w-10 text-[#8B5CF6] mb-4" />
            <p className="text-gray-300 text-lg">Processing resume...</p>
            <p className="text-gray-400 text-sm mt-2">
              This may take a few moments
            </p>
          </div>
        ) : resumeFile ? (
          <div className="flex flex-col items-center w-full">
            <div className="p-3 bg-[#252525] rounded-full text-[#8B5CF6] mb-4">
              <FiFile className="w-8 h-8" />
            </div>
            <p className="text-white font-medium text-lg">{resumeFile.name}</p>
            <p className="text-gray-400 text-sm mt-1">
              {(resumeFile.size / 1024).toFixed(1)} KB
            </p>

            <button
              onClick={handleClearFile}
              className="mt-4 px-4 py-2 bg-[#252525] hover:bg-[#333333] rounded-lg text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <FiX className="w-4 h-4" />
              Remove file
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 bg-[#252525] rounded-full text-[#8B5CF6] mb-4">
              <FiUpload className="w-10 h-10" />
            </div>
            <p className="text-white font-medium text-lg mb-2">
              Upload your resume
            </p>
            <p className="text-gray-400 text-sm text-center">
              Drag and drop your file here or click to browse
              <br />
              PDF or Word documents (.pdf, .doc, .docx)
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ===================================
// MAIN RESUME OPTIMIZER COMPONENT
// ===================================
export function ResumeOptimizerUI({
  isOpen,
  resumeText,
  jobDescription,
  setJobDescription,
  response,
  loading,
  error,
  activeTab,
  setActiveTab,
  handleSubmit,
  handleDownload,
  resumeFile,
  handleFileUpload,
  clearResumeFile,
  isProcessingFile,
}: {
  isOpen: boolean;
  resumeText: string;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  response: OptimizationResponse | null;
  loading: boolean;
  error: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDownload: () => void;
  resumeFile: File | null;
  handleFileUpload: (file: File) => void;
  clearResumeFile: () => void;
  isProcessingFile: boolean;
}) {
  return (
    // Main container with sidebar margin animation
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="p-8 min-h-screen bg-[#1A1A1A] relative"
    >
      {/* Background gradient elements for visual interest */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full filter blur-3xl opacity-30"></div>

      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="relative z-10 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font text-white"
          >
            AI Resume Optimizer
          </motion.h1>
          <p className="text-gray-400 mt-2 text-base">
            Enhance your resume for ATS systems and job-specific requirements
          </p>
        </div>

        {/* Form container */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#161616] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 border border-[#2A2A2A] mb-8 relative overflow-hidden"
        >
          {/* Background texture and subtle gradient */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

          <div className="grid gap-8 md:grid-cols-2 relative">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-300 font-medium mb-2 block">
                  Your Resume
                </span>

                {/* File Upload Area */}
                <FileUploadArea
                  onFileUpload={handleFileUpload}
                  resumeFile={resumeFile}
                  isProcessingFile={isProcessingFile}
                  clearResumeFile={clearResumeFile}
                />
              </label>

              {resumeText && (
                <div className="mt-4 p-4 bg-[#252525] border border-[#2A2A2A] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm font-medium">
                      Extracted Text
                    </span>
                    <span className="text-gray-400 text-xs">
                      {resumeText.length} characters
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto text-gray-400 text-sm">
                    {resumeText.substring(0, 300)}
                    {resumeText.length > 300 && "..."}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-300 font-medium mb-2 block">
                  Job Description
                </span>
                <textarea
                  placeholder="Paste the target job description..."
                  className="w-full p-4 bg-[#252525] border border-[#2A2A2A] rounded-lg focus:ring-2 focus:ring-[#8B5CF6]/50 resize-none h-64 text-gray-200"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isProcessingFile}
            className="w-full mt-8 bg-[#8B5CF6] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#7C3AED] transition flex items-center justify-center gap-2 relative z-10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin h-5 w-5" />
                Optimizing...
              </>
            ) : (
              <>
                <FiArrowRight className="h-5 w-5" />
                Optimize Resume
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-900/30 text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </form>

        {response && (
          <div className="bg-[#161616] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 border border-[#2A2A2A] mt-8 relative overflow-hidden">
            {/* Background texture and subtle gradient */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

            <div className="flex flex-wrap gap-4 mb-8 border-b border-[#2A2A2A] pb-4 relative">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "overview"
                    ? "bg-[#252525] text-[#8B5CF6]"
                    : "text-gray-400"
                }`}
              >
                <FiActivity className="w-5 h-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("resume")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "resume"
                    ? "bg-[#252525] text-[#8B5CF6]"
                    : "text-gray-400"
                }`}
              >
                <FiBookOpen className="w-5 h-5" />
                Optimized Resume
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "analysis"
                    ? "bg-[#252525] text-[#8B5CF6]"
                    : "text-gray-400"
                }`}
              >
                <FiTarget className="w-5 h-5" />
                Content Analysis
              </button>
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "recommendations"
                    ? "bg-[#252525] text-[#8B5CF6]"
                    : "text-gray-400"
                }`}
              >
                <FiZap className="w-5 h-5" />
                Recommendations
              </button>
              {response.format_analysis && (
                <button
                  onClick={() => setActiveTab("format")}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    activeTab === "format"
                      ? "bg-[#252525] text-[#8B5CF6]"
                      : "text-gray-400"
                  }`}
                >
                  <FiFileText className="w-5 h-5" />
                  Format Analysis
                </button>
              )}
            </div>

            <div className="relative">
              {activeTab === "overview" && (
                <div className="grid gap-6">
                  <AnalysisSection title="ATS Score" icon={<FiActivity />}>
                    <div className="flex items-center gap-6">
                      <RadialProgress
                        value={response.ats_score}
                        progressColor="#8B5CF6"
                        trackColor="#333333"
                        textClassName="text-lg font text-white"
                        size={100}
                      />
                      <div className="flex-1">
                        <ProgressBar value={response.ats_score} />
                        <div className="mt-4 text-sm text-gray-400">
                          This score reflects how well your resume matches the
                          job requirements based on ATS algorithms and keyword
                          optimization.
                        </div>
                      </div>
                    </div>

                    {response.ats_score_breakdown && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Keyword Matching
                          </h4>
                          <ProgressBar
                            value={
                              response.ats_score_breakdown.keyword_matching
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {response.ats_score_breakdown.keyword_matching}%
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Content Quality
                          </h4>
                          <ProgressBar
                            value={response.ats_score_breakdown.content_quality}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {response.ats_score_breakdown.content_quality}%
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Format Readability
                          </h4>
                          <ProgressBar
                            value={
                              response.ats_score_breakdown.format_readability
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {response.ats_score_breakdown.format_readability}%
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Quantified Achievements
                          </h4>
                          <ProgressBar
                            value={
                              response.ats_score_breakdown
                                .quantified_achievements
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {
                              response.ats_score_breakdown
                                .quantified_achievements
                            }
                            %
                          </p>
                        </div>
                      </div>
                    )}
                  </AnalysisSection>

                  {response.human_readability && (
                    <AnalysisSection
                      title="Human Readability Score"
                      icon={<FiUser />}
                    >
                      <div className="flex items-center gap-6">
                        <RadialProgress
                          value={response.human_readability.score}
                          progressColor="#22C55E"
                          trackColor="#333333"
                          textClassName="text-lg font text-white"
                          size={100}
                        />
                        <div className="flex-1">
                          <ProgressBar
                            value={response.human_readability.score}
                          />
                          <div className="mt-4 text-sm text-gray-400">
                            This score indicates how appealing your resume would
                            be to human recruiters, focusing on visual appeal,
                            storytelling, and impact.
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Visual Appeal
                          </h4>
                          <p className="text-sm text-gray-400">
                            {response.human_readability.visual_appeal}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Storytelling
                          </h4>
                          <p className="text-sm text-gray-400">
                            {response.human_readability.storytelling}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">
                            Impact Assessment
                          </h4>
                          <p className="text-sm text-gray-400">
                            {response.human_readability.impact_assessment}
                          </p>
                        </div>

                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-300 mb-3">
                            Improvement Suggestions
                          </h4>
                          <ul className="space-y-3">
                            {response.human_readability.improvement_suggestions.map(
                              (suggestion, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3 p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]"
                                >
                                  <div className="flex-shrink-0 mt-1 text-[#22C55E]">
                                    <FiZap className="w-4 h-4" />
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    {suggestion}
                                  </div>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </AnalysisSection>
                  )}
                </div>
              )}

              {activeTab === "format" && response.format_analysis && (
                <div className="grid gap-6">
                  <AnalysisSection
                    title="Format Analysis"
                    icon={<FiFileText />}
                  >
                    <div className="grid gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Page Count Assessment
                        </h4>
                        <p className="text-sm text-gray-400">
                          {response.format_analysis.page_count_assessment}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Font Assessment
                        </h4>
                        <p className="text-sm text-gray-400">
                          {response.format_analysis.font_assessment}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Color Assessment
                        </h4>
                        <p className="text-sm text-gray-400">
                          {response.format_analysis.color_assessment}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Spacing Assessment
                        </h4>
                        <p className="text-sm text-gray-400">
                          {response.format_analysis.spacing_assessment}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">
                          Overall Design Assessment
                        </h4>
                        <p className="text-sm text-gray-400">
                          {response.format_analysis.overall_design_assessment}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Format Recommendations
                      </h4>
                      <ul className="space-y-3">
                        {response.format_analysis.format_recommendations.map(
                          (recommendation, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]"
                            >
                              <div className="flex-shrink-0 mt-1 text-[#8B5CF6]">
                                <FiZap className="w-4 h-4" />
                              </div>
                              <div className="text-sm text-gray-300">
                                {recommendation}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </AnalysisSection>
                </div>
              )}

              {activeTab === "analysis" && (
                <div className="grid gap-6 md:grid-cols-2">
                  <AnalysisSection title="Strengths" icon={<FiThumbsUp />}>
                    <ul className="space-y-3">
                      {response.analysis.strengths.map((strength, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg"
                        >
                          <div className="flex-shrink-0 mt-1 text-green-500">
                            <FiThumbsUp className="w-4 h-4" />
                          </div>
                          <div className="text-sm text-green-400">
                            {strength}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AnalysisSection>

                  <AnalysisSection
                    title="Weaknesses"
                    icon={<FiAlertTriangle />}
                  >
                    <ul className="space-y-3">
                      {response.analysis.weaknesses.map((weakness, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 p-3 bg-red-900/20 rounded-lg"
                        >
                          <div className="flex-shrink-0 mt-1 text-red-400">
                            <FiAlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="text-sm text-red-400">{weakness}</div>
                        </li>
                      ))}
                    </ul>
                  </AnalysisSection>
                </div>
              )}

              {activeTab === "recommendations" && (
                <div className="grid gap-6">
                  <AnalysisSection
                    title="Improvement Recommendations"
                    icon={<FiZap />}
                  >
                    <ul className="space-y-4">
                      {response.analysis.recommendations.map(
                        (recommendation, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-4 p-4 bg-[#252525] rounded-lg border border-[#2A2A2A]"
                          >
                            <div className="flex-shrink-0 mt-1 text-[#8B5CF6]">
                              <FiZap className="w-5 h-5" />
                            </div>
                            <div className="text-sm text-gray-300">
                              {recommendation}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </AnalysisSection>
                </div>
              )}

              {activeTab === "resume" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      Optimized Resume
                    </h3>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 text-[#8B5CF6] hover:text-[#7C3AED] bg-[#252525] px-4 py-2 rounded-lg border border-[#2A2A2A]"
                    >
                      <FiDownload className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                  <div className="bg-[#252525] rounded-lg p-6 border border-[#2A2A2A]">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                      {response.optimized_resume}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
