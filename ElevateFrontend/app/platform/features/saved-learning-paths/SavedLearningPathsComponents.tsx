"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen,
  FiLoader,
  FiTrash2,
  FiCalendar,
  FiBarChart,
  FiChevronRight,
  FiHeart,
  FiClock,
  FiTarget,
  FiZap,
  FiStar,
  FiCheckCircle,
  FiCode,
  FiAward,
  FiFlag,
  FiExternalLink,
  FiGlobe,
  FiTool,
  FiPlay,
  FiFolder,
  FiRefreshCw,
} from "react-icons/fi";
import { SavedPathway } from "./SavedLearningPathsLogic";

// Import the pathway display components we already have
import { PathwayDisplay } from "../learning-paths/LearningPathsComponents";
import { Pathway } from "../learning-paths/LearningPathsLogic";
import { LearningPathway } from "./SavedLearningPathsLogic";

// ------------------
// Loading and State Components
// ------------------

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <div className="flex items-center gap-3">
        <FiLoader className="animate-spin h-8 w-8 text-[#8B5CF6]" />
        <span className="text-lg text-gray-300">Loading saved pathways...</span>
      </div>
    </div>
  );
}

export function UnauthenticatedState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <p className="text-lg font-medium text-gray-300">
        Please log in to access your saved learning pathways.
      </p>
    </div>
  );
}

// ------------------
// Header Component
// ------------------

export function SavedPathwaysHeader() {
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
          className="text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Saved Learning Pathways
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed"
        >
          Continue your learning journey with your saved pathways and track your
          progress
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
              <FiHeart className="w-3.5 h-3.5 text-[#8B5CF6]" />
            </div>
            <span className="text-xs">Your Collection</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="p-1.5 bg-[#22C55E]/20 rounded-lg">
              <FiBarChart className="w-3.5 h-3.5 text-[#22C55E]" />
            </div>
            <span className="text-xs">Progress Tracking</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="p-1.5 bg-[#F97316]/20 rounded-lg">
              <FiRefreshCw className="w-3.5 h-3.5 text-[#F97316]" />
            </div>
            <span className="text-xs">Sync Across Devices</span>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}

// ------------------
// Empty State Component
// ------------------

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="mb-8">
        <div className="w-24 h-24 bg-[#252525] rounded-full flex items-center justify-center mx-auto mb-6">
          <FiFolder className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          No Saved Pathways Yet
        </h3>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Start by generating a learning pathway and save it to track your
          progress over time.
        </p>
        <motion.a
          href="/platform/features/learning-paths"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-semibold text-lg shadow-lg transition-all duration-200"
        >
          <FiZap className="w-5 h-5" />
          Generate Learning Pathway
        </motion.a>
      </div>
    </motion.div>
  );
}

// ------------------
// Saved Pathway Card Component
// ------------------

interface SavedPathwayCardProps {
  pathway: SavedPathway;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  completedItems: Map<string, Set<string>>;
  toggleItemCompletion: (pathwayId: string, itemId: string) => void;
  isItemCompleted: (pathwayId: string, itemId: string) => boolean;
  getProgressStats: (
    pathwayId: string,
    pathway?: LearningPathway
  ) => {
    completed: number;
    total: number;
    percentage: number;
  };
}

function SavedPathwayCard({
  pathway,
  isExpanded,
  onToggleExpand,
  onDelete,
  completedItems,
  toggleItemCompletion,
  isItemCompleted,
  getProgressStats,
}: SavedPathwayCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const progressStats = getProgressStats(
    pathway.pathway_id,
    pathway.learning_pathway
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#161616] rounded-2xl p-6 border border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#22C55E]/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              {pathway.topic} Learning Pathway
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                <span>
                  Saved {formatDate(pathway.saved_at || pathway.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>
                  Last accessed{" "}
                  {formatDate(
                    pathway.progress?.last_accessed || pathway.updatedAt
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleDelete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-lg transition-colors ${
                showDeleteConfirm
                  ? "bg-red-500 text-white"
                  : "bg-[#252525] text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              }`}
            >
              <FiTrash2 className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={onToggleExpand}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-[#252525] rounded-lg hover:bg-[#2A2A2A] transition-colors"
            >
              <FiChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-300">Progress</span>
            <span className="text-xs text-[#8B5CF6] font-semibold">
              {progressStats.percentage}% Complete
            </span>
          </div>
          <div className="w-full h-3 bg-[#333333] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressStats.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] rounded-full"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>
              {progressStats.completed} of {progressStats.total} items completed
            </span>
            <span>
              {progressStats.total - progressStats.completed} remaining
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <div className="text-lg font-semibold text-white">
              {pathway.learning_pathway?.steps?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Steps</div>
          </div>
          <div className="text-center p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <div className="text-lg font-semibold text-white">
              {pathway.learning_pathway?.steps?.reduce(
                (acc: number, step) => acc + (step.topics?.length || 0),
                0
              ) || 0}
            </div>
            <div className="text-xs text-gray-400">Topics</div>
          </div>
          <div className="text-center p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <div className="text-lg font-semibold text-white">
              {pathway.learning_pathway?.timeline ||
                pathway.learning_pathway?.total_duration ||
                "N/A"}
            </div>
            <div className="text-xs text-gray-400">Timeline</div>
          </div>
        </div>

        {/* Confirmation text for delete */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-center"
            >
              <p className="text-red-400 text-sm font-medium">
                Click delete again to confirm removal
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && pathway.learning_pathway && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-[#2A2A2A] pt-6 mt-6"
            >
              <PathwayDisplay
                pathway={
                  {
                    ...pathway.learning_pathway,
                    topic: pathway.topic,
                    timeline:
                      pathway.learning_pathway.timeline ||
                      pathway.learning_pathway.total_duration ||
                      "Unknown",
                    steps: pathway.learning_pathway.steps || [],
                  } as unknown as Pathway
                }
                toggleItemCompletion={(itemId: string) =>
                  toggleItemCompletion(pathway.pathway_id, itemId)
                }
                isItemCompleted={(itemId: string) =>
                  isItemCompleted(pathway.pathway_id, itemId)
                }
                getProgressStats={() => progressStats}
                // Don't show save button for already saved pathways
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ------------------
// Saved Pathways List Component
// ------------------

interface SavedPathwaysListProps {
  savedPathways: SavedPathway[];
  expandedPathway: string | null;
  setExpandedPathway: (id: string | null) => void;
  deletePathway: (pathwayId: string) => void;
  updateProgress: (pathwayId: string, progressData: any) => void;
  completedItems: Map<string, Set<string>>;
  toggleItemCompletion: (pathwayId: string, itemId: string) => void;
  isItemCompleted: (pathwayId: string, itemId: string) => boolean;
  getProgressStats: (
    pathwayId: string,
    pathway?: LearningPathway
  ) => {
    completed: number;
    total: number;
    percentage: number;
  };
}

export function SavedPathwaysList({
  savedPathways,
  expandedPathway,
  setExpandedPathway,
  deletePathway,
  updateProgress,
  completedItems,
  toggleItemCompletion,
  isItemCompleted,
  getProgressStats,
}: SavedPathwaysListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">
          Your Learning Pathways ({savedPathways.length})
        </h2>
        <div className="text-sm text-gray-400">
          Click on a pathway to expand and continue learning
        </div>
      </div>

      {savedPathways.map((pathway) => (
        <SavedPathwayCard
          key={pathway.pathway_id}
          pathway={pathway}
          isExpanded={expandedPathway === pathway.pathway_id}
          onToggleExpand={() =>
            setExpandedPathway(
              expandedPathway === pathway.pathway_id ? null : pathway.pathway_id
            )
          }
          onDelete={() => deletePathway(pathway.pathway_id)}
          completedItems={completedItems}
          toggleItemCompletion={toggleItemCompletion}
          isItemCompleted={isItemCompleted}
          getProgressStats={getProgressStats}
        />
      ))}
    </div>
  );
}
