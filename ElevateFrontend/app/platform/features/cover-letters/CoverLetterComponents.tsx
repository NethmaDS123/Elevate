"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  // FiUser, // Commented out as it's not used
  FiEdit3,
  FiMail,
  FiStar,
  FiSave,
  FiCheck,
  FiFolder,
} from "react-icons/fi";
import { RadialProgress } from "@/components/RadialProgress";
import { CoverLetterResponse } from "./CoverLetterLogic";

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

// Navigate to Saved Cover Letters Button
export function SavedCoverLettersButton() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/platform/features/saved-cover-letters");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleNavigate}
      className="flex items-center gap-2 px-4 py-2 bg-[#252525] hover:bg-[#2A2A2A] text-gray-300 hover:text-white rounded-xl transition-all border border-[#2A2A2A] hover:border-[#404040] shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
    >
      <FiFolder size={16} />
      <span className="font-medium">View Saved</span>
    </motion.button>
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
      Please log in to use the Cover Letter Generator.
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
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
      ];

      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF, Word document, or text file.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size must be less than 10MB.");
        return;
      }

      onFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain",
      ];

      if (!validTypes.includes(file.type)) {
        alert("Please upload a PDF, Word document, or text file.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size must be less than 10MB.");
        return;
      }

      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FiUpload className="w-5 h-5 text-[#8B5CF6]" />
          Upload Resume
        </h3>
        {resumeFile && (
          <button
            onClick={clearResumeFile}
            className="text-red-400 hover:text-red-300 transition-colors p-1.5 hover:bg-red-900/20 rounded-lg"
            title="Clear resume file"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {!resumeFile ? (
        <div
          className="border-2 border-dashed border-[#404040] rounded-xl p-8 text-center bg-[#252525] hover:border-[#8B5CF6] hover:bg-[#2A2A2A] transition-all cursor-pointer group shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="group-hover:scale-110 transition-transform">
            <FiUpload className="mx-auto h-12 w-12 text-[#8B5CF6] mb-4" />
          </div>
          <p className="text-white mb-2 font-medium">
            Click to upload or drag and drop your resume
          </p>
          <p className="text-gray-400 text-sm">
            Supports PDF, Word documents, and text files (max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-[#252525] rounded-xl p-4 border border-[#2A2A2A] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B5CF6]/20 rounded-lg">
              <FiFile className="text-[#8B5CF6]" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{resumeFile.name}</p>
              <p className="text-gray-400 text-sm">
                {(resumeFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {isProcessingFile && (
              <div className="p-2">
                <FiLoader className="animate-spin text-[#8B5CF6]" size={20} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Job Description Input Component
export function JobDescriptionInput({
  jobDescription,
  setJobDescription,
}: {
  jobDescription: string;
  setJobDescription: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FiFileText className="w-5 h-5 text-[#22C55E]" />
        Job Description
      </h3>
      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-64 p-4 bg-[#252525] border border-[#2A2A2A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all"
        />
        {jobDescription && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-[#161616] px-2 py-1 rounded">
            {jobDescription.length} characters
          </div>
        )}
      </div>
    </div>
  );
}

// Editable Cover Letter Component
export function EditableCoverLetter({
  coverLetter,
  onEdit,
}: {
  coverLetter: string;
  onEdit: (newContent: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(coverLetter);

  // Format the cover letter to handle escape characters and improve readability
  const formatCoverLetter = (text: string) => {
    return text
      .replace(/\\n\\n/g, "\n\n") // Replace \\n\\n with actual double line breaks
      .replace(/\\n/g, "\n") // Replace \\n with actual line breaks
      .replace(/\n{3,}/g, "\n\n") // Replace multiple line breaks with double line breaks
      .trim(); // Remove leading/trailing whitespace
  };

  const formattedCoverLetter = formatCoverLetter(coverLetter);

  const handleSave = () => {
    onEdit(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(coverLetter);
    setIsEditing(false);
  };

  // Update editContent when coverLetter changes
  useEffect(() => {
    setEditContent(formatCoverLetter(coverLetter));
  }, [coverLetter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
          <div className="p-2 bg-[#8B5CF6]/20 rounded-lg">
            <FiMail className="text-[#8B5CF6] w-5 h-5" />
          </div>
          Generated Cover Letter
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] ${
            isEditing
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30"
          }`}
        >
          <FiEdit3 size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </motion.button>
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-96 p-6 bg-[#252525] border border-[#2A2A2A] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent resize-none font-sans leading-relaxed shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all"
              placeholder="Edit your cover letter..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-[#161616] px-2 py-1 rounded">
              {editContent.length} characters
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl hover:from-[#16A34A] hover:to-[#15803D] transition-all font-medium shadow-[0_4px_15px_rgba(34,197,94,0.3)]"
            >
              Save Changes
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="px-6 py-3 bg-[#404040] text-white rounded-xl hover:bg-[#4A4A4A] transition-all font-medium shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#252525] rounded-xl p-6 border border-[#2A2A2A] shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
        >
          <div
            className="text-white font-sans leading-relaxed text-base"
            style={{ whiteSpace: "pre-line" }}
          >
            {formattedCoverLetter}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Analysis Results Component
export function AnalysisResults({
  response,
}: {
  response: CoverLetterResponse;
}) {
  return (
    <div className="space-y-6">
      {/* Story Flow Score */}
      <AnalysisSection title="Story Flow Score" icon={<FiTarget />}>
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <RadialProgress
              value={response.story_flow_score * 10}
              size={80}
              strokeWidth={8}
              progressColor="#8B5CF6"
              trackColor="#333333"
            />
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-white">
                {response.story_flow_score}
              </span>
              <span className="text-gray-400">/10</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-300 leading-relaxed">
              {response.alignment_explanation}
            </p>
          </div>
        </div>
      </AnalysisSection>

      {/* Research Depth */}
      <AnalysisSection title="Company Research Depth" icon={<FiBookOpen />}>
        <div className="p-4 bg-[#252525] rounded-lg">
          <p className="text-gray-300 leading-relaxed">
            {response.research_depth}
          </p>
        </div>
      </AnalysisSection>

      {/* Narrative Strengths */}
      <AnalysisSection title="Narrative Connections" icon={<FiThumbsUp />}>
        <div className="space-y-3">
          {response.narrative_strengths.map((strength, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-[#252525] rounded-lg"
            >
              <FiStar className="text-[#8B5CF6] mt-1 flex-shrink-0" size={16} />
              <p className="text-gray-300">{strength}</p>
            </div>
          ))}
        </div>
      </AnalysisSection>

      {/* Improvement Suggestions */}
      <AnalysisSection title="Improvement Suggestions" icon={<FiZap />}>
        <div className="space-y-3">
          {response.improvement_suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-[#252525] rounded-lg"
            >
              <FiAlertTriangle
                className="text-yellow-500 mt-1 flex-shrink-0"
                size={16}
              />
              <p className="text-gray-300">{suggestion}</p>
            </div>
          ))}
        </div>
      </AnalysisSection>
    </div>
  );
}

// Tab Navigation Component
export function TabNavigation({
  activeTab,
  setActiveTab,
  hasResponse,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasResponse: boolean;
}) {
  const tabs = [
    { id: "cover-letter", label: "Cover Letter", icon: FiMail },
    {
      id: "analysis",
      label: "Analysis",
      icon: FiActivity,
      disabled: !hasResponse,
    },
  ];

  return (
    <div className="flex space-x-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            whileHover={{ scale: tab.disabled ? 1 : 1.02 }}
            whileTap={{ scale: tab.disabled ? 1 : 0.98 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
                : tab.disabled
                ? "text-gray-500 cursor-not-allowed bg-[#252525]"
                : "text-gray-300 hover:text-white hover:bg-[#252525] bg-[#252525]/50"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// Main Cover Letter Generator UI Component
export function CoverLetterGeneratorUI({
  isOpen,
  resumeText,
  // setResumeText, // Commented out as it's not used
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
  handleCoverLetterEdit,
  handleSaveCoverLetter,
  isSaving,
  saveSuccess,
}: {
  isOpen: boolean;
  resumeText: string;
  setResumeText: (value: string) => void;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  response: CoverLetterResponse | null;
  loading: boolean;
  error: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSubmit: () => void;
  handleDownload: () => void;
  resumeFile: File | null;
  handleFileUpload: (file: File) => void;
  clearResumeFile: () => void;
  isProcessingFile: boolean;
  handleCoverLetterEdit: (newContent: string) => void;
  handleSaveCoverLetter: (companyName: string, jobTitle: string) => void;
  isSaving: boolean;
  saveSuccess: string | null;
}) {
  const canGenerate =
    (resumeText.trim() || resumeFile) &&
    jobDescription.trim() &&
    !loading &&
    !isProcessingFile;

  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleSaveSubmit = (companyName: string, jobTitle: string) => {
    handleSaveCoverLetter(companyName, jobTitle);
    setShowSaveModal(false);
  };

  return (
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="p-8 min-h-screen bg-[#1A1A1A] relative"
    >
      {/* Background gradient elements for visual interest */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full filter blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-white flex items-center gap-3"
            >
              <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#8B5CF6]">
                <FiMail className="w-6 h-6" />
              </div>
              Cover Letter Generator
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SavedCoverLettersButton />
            </motion.div>
          </div>
          <p className="text-gray-400 mt-2 text-base">
            Create personalized, professional cover letters that highlight your
            strengths and align with job requirements.
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload Card */}
          <div className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative">
            {/* Background texture and subtle gradient */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

            <div className="relative z-10">
              <FileUploadArea
                onFileUpload={handleFileUpload}
                resumeFile={resumeFile}
                isProcessingFile={isProcessingFile}
                clearResumeFile={clearResumeFile}
              />

              {resumeText && (
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FiFileText className="w-4 h-4 text-[#8B5CF6]" />
                    Extracted Resume Text
                  </h4>
                  <div className="bg-[#252525] rounded-lg p-4 border border-[#2A2A2A] max-h-32 overflow-y-auto shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {resumeText.slice(0, 200)}
                      {resumeText.length > 200 && "..."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Card */}
          <div className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative">
            {/* Background texture and subtle gradient */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full filter blur-3xl"></div>

            <div className="relative z-10">
              <JobDescriptionInput
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: canGenerate ? 1.02 : 1 }}
            whileTap={{ scale: canGenerate ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={!canGenerate}
            className={`flex items-center gap-3 mx-auto px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
              canGenerate
                ? "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white shadow-[0_8px_30px_rgba(139,92,246,0.3)]"
                : "bg-[#404040] text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <FiLoader className="animate-spin" size={20} />
            ) : (
              <FiArrowRight size={20} />
            )}
            {loading ? "Generating Cover Letter..." : "Generate Cover Letter"}
          </motion.button>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-green-400 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center gap-3">
                <FiCheck className="w-5 h-5 text-green-500" />
                <span>{saveSuccess}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="w-5 h-5 text-red-500" />
                <span>{error}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <div className="bg-[#161616] rounded-xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A]">
              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hasResponse={!!response}
              />
            </div>

            {/* Tab Content */}
            {activeTab === "cover-letter" && (
              <div className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

                <div className="relative z-10 space-y-6">
                  <EditableCoverLetter
                    coverLetter={response.cover_letter}
                    onEdit={handleCoverLetterEdit}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#2A2A2A]">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveClick}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white rounded-xl hover:from-[#16A34A] hover:to-[#15803D] transition-all shadow-[0_4px_15px_rgba(34,197,94,0.3)] font-medium"
                    >
                      <FiSave size={16} />
                      Save Cover Letter
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all shadow-[0_8px_30px_rgba(139,92,246,0.3)] font-medium"
                    >
                      <FiDownload size={16} />
                      Download
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full filter blur-3xl"></div>

                <div className="relative z-10">
                  <AnalysisResults response={response} />
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Save Modal */}
        <SaveCoverLetterModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveSubmit}
          isSaving={isSaving}
        />
      </div>
    </motion.div>
  );
}

// Save Cover Letter Modal Component
export function SaveCoverLetterModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (companyName: string, jobTitle: string) => void;
  isSaving: boolean;
}) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim() && jobTitle.trim()) {
      onSave(companyName.trim(), jobTitle.trim());
      // Reset form after save
      setCompanyName("");
      setJobTitle("");
    }
  };

  const handleClose = () => {
    setCompanyName("");
    setJobTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#161616] rounded-xl p-6 w-full max-w-md border border-[#2A2A2A] shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#8B5CF6]/20 rounded-lg">
            <FiSave className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Save Cover Letter
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google, Microsoft, Apple"
              className="w-full p-3 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager"
              className="w-full p-3 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent transition-all"
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: isSaving ? 1 : 1.02 }}
              whileTap={{ scale: isSaving ? 1 : 0.98 }}
              type="submit"
              disabled={isSaving || !companyName.trim() || !jobTitle.trim()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                isSaving || !companyName.trim() || !jobTitle.trim()
                  ? "bg-[#404040] text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
              }`}
            >
              {isSaving ? (
                <FiLoader className="animate-spin w-4 h-4" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Cover Letter"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="px-4 py-3 bg-[#404040] text-white rounded-xl hover:bg-[#4A4A4A] transition-all font-medium disabled:opacity-50"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
