"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSidebar } from "@/components/SidebarContext";
import { useSavedLearningPaths } from "./SavedLearningPathsLogic";
import {
  LoadingState,
  UnauthenticatedState,
  SavedPathwaysHeader,
  SavedPathwaysList,
  EmptyState,
} from "./SavedLearningPathsComponents";

export default function SavedLearningPathwaysPage() {
  const { isOpen } = useSidebar();
  const {
    // State
    savedPathways,
    loading,
    error,
    session,
    status,
    expandedPathway,
    setExpandedPathway,

    // Actions
    fetchSavedPathways,
    deletePathway,
    updateProgress,

    // Progress tracking
    completedItems,
    toggleItemCompletion,
    isItemCompleted,
    getProgressStats,
  } = useSavedLearningPaths();

  // Render loading state if session status is loading
  if (status === "loading") {
    return <LoadingState />;
  }

  // Render login prompt if session is not found
  if (!session) {
    return <UnauthenticatedState />;
  }

  // Main render function
  return (
    <motion.div
      animate={{ marginLeft: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8 relative"
    >
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#22C55E]/5 rounded-full filter blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <SavedPathwaysHeader />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={fetchSavedPathways}
              className="mt-4 px-6 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : savedPathways.length === 0 ? (
          <EmptyState />
        ) : (
          <SavedPathwaysList
            savedPathways={savedPathways}
            expandedPathway={expandedPathway}
            setExpandedPathway={setExpandedPathway}
            deletePathway={deletePathway}
            toggleItemCompletion={toggleItemCompletion}
            isItemCompleted={isItemCompleted}
            getProgressStats={getProgressStats}
          />
        )}
      </div>
    </motion.div>
  );
}
