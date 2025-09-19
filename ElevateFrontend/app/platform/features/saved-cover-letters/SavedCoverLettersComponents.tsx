"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiLoader,
  FiDownload,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiBriefcase,
  FiMail,
  FiAlertTriangle,
  FiFileText,
} from "react-icons/fi";
import { SavedCoverLetter } from "./SavedCoverLettersLogic";

// ===================================
// STATE COMPONENTS
// ===================================

export function LoadingState() {
  return (
    <div className="p-8 flex items-center justify-center bg-[#121212] rounded-lg">
      <FiLoader className="animate-spin h-8 w-8 text-[#8B5CF6]" />
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-8 text-red-400 bg-[#121212] rounded-lg">{message}</div>
  );
}

export function UnauthenticatedState() {
  return (
    <div className="p-8 text-gray-300 bg-[#121212] rounded-lg">
      Please log in to view your saved cover letters.
    </div>
  );
}

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="bg-[#161616] rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] max-w-md mx-auto">
        <div className="p-4 bg-[#8B5CF6]/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <FiMail className="w-10 h-10 text-[#8B5CF6]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">
          No Saved Cover Letters
        </h3>
        <p className="text-gray-400 mb-6">
          You haven&apos;t saved any cover letters yet. Generate and save your
          first cover letter to see it here.
        </p>
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="/platform/features/cover-letters"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-xl hover:from-[#7C3AED] hover:to-[#6D28D9] transition-all shadow-[0_4px_15px_rgba(139,92,246,0.3)] font-medium"
        >
          <FiMail size={16} />
          Generate Cover Letter
        </motion.a>
      </div>
    </motion.div>
  );
}

// ===================================
// COVER LETTER CARD COMPONENT
// ===================================

export function CoverLetterCard({
  coverLetter,
  onDelete,
  onDownload,
  isDeleting,
}: {
  coverLetter: SavedCoverLetter;
  onDelete: (id: string) => void;
  onDownload: (coverLetter: SavedCoverLetter) => void;
  isDeleting: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(coverLetter.cover_letter_id);
    setShowDeleteConfirm(false);
  };

  const previewText = coverLetter.cover_letter_content.slice(0, 200);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative group"
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full filter blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#8B5CF6]/20 rounded-lg">
                <FiBriefcase className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {coverLetter.company_name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <FiBriefcase className="w-4 h-4" />
              <span className="text-sm">{coverLetter.job_title}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <FiCalendar className="w-4 h-4" />
              <span>Created {formatDate(coverLetter.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDownload(coverLetter)}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Download"
            >
              <FiDownload size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              {isDeleting ? (
                <FiLoader className="animate-spin w-4 h-4" />
              ) : (
                <FiTrash2 size={16} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="border-t border-[#2A2A2A] pt-4">
          <div
            className={`text-gray-300 text-sm leading-relaxed ${
              isExpanded ? "" : "line-clamp-3"
            }`}
          >
            {isExpanded ? (
              <div className="whitespace-pre-line">
                {coverLetter.cover_letter_content}
              </div>
            ) : (
              <>
                {previewText}
                {coverLetter.cover_letter_content.length > 200 && "..."}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#161616] rounded-xl p-6 w-full max-w-sm border border-[#2A2A2A] shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <FiAlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Delete Cover Letter
              </h3>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the cover letter for{" "}
              <strong>{coverLetter.company_name}</strong>? This action cannot be
              undone.
            </p>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Delete
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-[#404040] text-white rounded-lg hover:bg-[#4A4A4A] transition-colors font-medium"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ===================================
// MAIN SAVED COVER LETTERS UI
// ===================================

export function SavedCoverLettersUI({
  isOpen,
  coverLetters,
  loading,
  error,
  deleting,
  onDelete,
  onDownload,
}: {
  isOpen: boolean;
  coverLetters: SavedCoverLetter[];
  loading: boolean;
  error: string | null;
  deleting: string | null;
  onDelete: (id: string) => void;
  onDownload: (coverLetter: SavedCoverLetter) => void;
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white flex items-center gap-3"
          >
            <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#8B5CF6]">
              <FiFileText className="w-6 h-6" />
            </div>
            Saved Cover Letters
          </motion.h1>
          <p className="text-gray-400 mt-2 text-base">
            Manage and download your previously saved cover letters.
          </p>
        </div>

        {/* Stats */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] mb-8"
          >
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {coverLetters.length}
                </div>
                <div className="text-sm text-gray-400">Saved Letters</div>
              </div>
              <div className="w-px h-12 bg-[#2A2A2A]"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {
                    new Set(coverLetters.map((letter) => letter.company_name))
                      .size
                  }
                </div>
                <div className="text-sm text-gray-400">Companies</div>
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

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <FiLoader className="animate-spin h-12 w-12 text-[#8B5CF6] mx-auto mb-4" />
              <p className="text-gray-400">Loading saved cover letters...</p>
            </div>
          </div>
        ) : coverLetters.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {coverLetters.map((coverLetter) => (
              <CoverLetterCard
                key={coverLetter.cover_letter_id}
                coverLetter={coverLetter}
                onDelete={onDelete}
                onDownload={onDownload}
                isDeleting={deleting === coverLetter.cover_letter_id}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
