"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiCode, FiLoader, FiMessageSquare } from "react-icons/fi";
import { useSidebar } from "@/components/SidebarContext";
import { useInterviewPrep } from "./InterviewPrepLogic";
import {
  LoadingState,
  UnauthenticatedState,
  Modal,
  TechnicalGuide,
  BehavioralGuide,
  QuestionBreakdown,
  AnswerFeedback,
} from "./InterviewPrepComponents";

export default function InterviewPreparation() {
  const { isOpen } = useSidebar();
  const {
    // State
    error,
    prepType,
    setPrepType,
    userQuestion,
    setUserQuestion,
    userAnswer,
    setUserAnswer,
    analysis,
    feedback,
    loading,
    activeTab,
    setActiveTab,
    modalOpen,
    modalTitle,
    modalContent,
    session,
    status,

    // Actions
    openModal,
    closeModal,
    handleQuestionAnalysis,
    handleAnswerSubmit,
  } = useInterviewPrep();

  if (status === "loading") {
    return <LoadingState />;
  }

  if (!session) {
    return <UnauthenticatedState />;
  }

  return (
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full filter blur-3xl opacity-30"></div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle}>
        <p className="text-gray-300 whitespace-pre-line">{modalContent}</p>
      </Modal>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Elevate Interview Preparation
          </motion.h1>
          <p className="text-gray-400 text-lg">
            Technical Excellence Meets Strategic Communication
          </p>
        </header>

        {/* Prep Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => setPrepType("technical")}
            className={`p-6 rounded-xl transition-all border-2 ${
              prepType === "technical"
                ? "border-[#8B5CF6] bg-[#161616] shadow-lg"
                : "border-[#2A2A2A] hover:border-[#8B5CF6]/30 bg-[#161616]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  prepType === "technical" ? "bg-[#8B5CF6]" : "bg-[#252525]"
                }`}
              >
                <FiCode className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Technical</h3>
                <p className="text-gray-400 text-sm">DSA, System Design</p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setPrepType("behavioral")}
            className={`p-6 rounded-xl transition-all border-2 ${
              prepType === "behavioral"
                ? "border-[#22C55E] bg-[#161616] shadow-lg"
                : "border-[#2A2A2A] hover:border-[#22C55E]/30 bg-[#161616]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  prepType === "behavioral" ? "bg-[#22C55E]" : "bg-[#252525]"
                }`}
              >
                <FiMessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Behavioral</h3>
                <p className="text-gray-400 text-sm">STAR Method, Examples</p>
              </div>
            </div>
          </button>
        </div>

        {/* Guide Components */}
        {prepType === "technical" ? (
          <TechnicalGuide openModal={openModal} />
        ) : (
          <BehavioralGuide openModal={openModal} />
        )}

        {/* Question Analysis Form */}
        <form
          onSubmit={handleQuestionAnalysis}
          className="bg-[#161616] rounded-xl border border-[#2A2A2A] p-8 mb-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Analyze Coding Question
              </label>
              <textarea
                placeholder="Paste LeetCode/etc question..."
                className="w-full p-4 border border-[#333333] rounded-lg bg-[#252525] focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] resize-none h-32 text-white placeholder-gray-500"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin h-5 w-5" /> Analyzing...
                </div>
              ) : (
                "Generate Breakdown"
              )}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            <div className="bg-[#161616] rounded-xl border border-[#2A2A2A] p-8">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("breakdown")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "breakdown"
                      ? "bg-[#8B5CF6]/20 text-[#8B5CF6]"
                      : "text-gray-400 hover:bg-[#252525] hover:text-gray-300"
                  }`}
                >
                  Breakdown
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "feedback"
                      ? "bg-[#22C55E]/20 text-[#22C55E]"
                      : "text-gray-400 hover:bg-[#252525] hover:text-gray-300"
                  }`}
                >
                  Your Solution
                </button>
              </div>
              {activeTab === "feedback" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      placeholder="Write your solution..."
                      className="w-full p-4 border border-[#333333] rounded-lg bg-[#252525] focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E] resize-none h-48 text-white placeholder-gray-500 font-mono text-sm"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={loading}
                    className="py-3 px-6 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? "Getting Feedback..." : "Get Feedback"}
                  </button>
                  {feedback && <AnswerFeedback feedback={feedback} />}
                </div>
              ) : (
                <QuestionBreakdown analysis={analysis} />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
