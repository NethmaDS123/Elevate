"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiBook,
  FiFileText,
  FiCheckCircle,
  FiZap,
  FiLayers,
  FiCalendar,
  FiUser,
  FiChevronRight,
  FiLoader,
} from "react-icons/fi";
import { RadialProgress } from "@/components/RadialProgress";
import Link from "next/link";
import { DashboardResponse, QuickAction } from "./DashboardLogic";
import { ReactNode } from "react";

// ===================================
// LEARNING PATHWAYS CARD COMPONENT
// ===================================
export function LearningPathwaysPreview({
  paths,
}: {
  paths: Array<{ icon: ReactNode; title: string; progress: number }>;
}) {
  return (
    // Card container with shadow and hover effects
    <div className="md:col-span-2 bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] group overflow-hidden relative">
      {/* Background texture and subtle gradient */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

      {/* Card header with title and "View All" link */}
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-lg font flex items-center gap-3 text-white">
          {/* Icon container with purple accent */}
          <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#8B5CF6]">
            <FiBook className="w-5 h-5" />
          </div>
          Learning Pathways
        </h2>
        <div className="flex items-center gap-4">
          <Link
            href="/platform/features/saved-learning-paths"
            className="text-gray-400 flex items-center gap-1 hover:text-[#22C55E] transition-colors text-sm"
          >
            Saved Paths
            <FiChevronRight className="w-4 h-4 hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/platform/features/learning-paths"
            className="text-gray-400 flex items-center gap-1 group-hover:text-[#8B5CF6] transition-colors text-sm"
          >
            View All
            <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Learning paths list with hover animations */}
      <div className="space-y-4 mb-6">
        {paths.slice(0, 2).map((path, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.01, y: -2 }}
            className="group relative p-4 bg-[#252525] rounded-xl border border-[#2A2A2A] hover:border-[#8B5CF6]/30 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.15)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Path icon with purple accent */}
                <div className="p-2 bg-[#2A2A2A] rounded-xl text-[#8B5CF6]">
                  {path.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{path.title}</h3>
                  {/* Progress bar with gradient fill */}
                  <div className="w-full bg-[#333333] rounded-xl h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-[#8B5CF6]/70 to-[#8B5CF6] h-2 rounded-xl transition-all duration-500"
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action button with gradient and hover effects */}
      <Link
        href="/platform/features/learning-paths"
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#252525] text-white rounded-[6px] hover:bg-[#2A2A2A] transition-all text-sm font-medium border border-[#2A2A2A] hover:border-[#333333] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:translate-y-[-1px]"
      >
        Continue Learning
      </Link>
    </div>
  );
}

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
      Please log in to view your dashboard.
    </div>
  );
}

// No data available component
export function NoDataState() {
  return (
    <div className="p-8 text-gray-300 bg-[#121212] rounded-lg">
      No data available.
    </div>
  );
}

// ===================================
// MAIN DASHBOARD UI COMPONENT
// ===================================
export function DashboardUI({
  isOpen,
  dashboardData,
  staticQuickActions,
}: {
  isOpen: boolean;
  dashboardData: DashboardResponse;
  staticQuickActions: QuickAction[];
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

      {/* Page header with welcome message */}
      <div className="relative z-10 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font text-white"
        >
          Welcome Back, {dashboardData.user.name}
        </motion.h1>
        <p className="text-gray-400 mt-2 text-base">
          Your career progress summary
        </p>
      </div>

      {/* Main content grid layout */}
      <div className="relative z-10 flex flex-col xl:flex-row gap-6">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {/* ===== RESUME ATS SCORE CARD ===== */}
          <div className="md:col-span-2 bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative">
            {/* Background texture and subtle gradient */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

            <div className="flex items-center justify-between mb-6 relative">
              <h2 className="text-lg font flex items-center gap-3 text-white">
                {/* Card icon with purple accent */}
                <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#8B5CF6]">
                  <FiFileText className="w-5 h-5" />
                </div>
                Resume ATS Score
              </h2>
              {/* Circular progress indicator */}
              <RadialProgress
                value={dashboardData.resumeHealth.score}
                progressColor="#8B5CF6"
                trackColor="#333333"
                textClassName="text-lg font text-white"
              />
            </div>

            {/* Stats grid with two metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Current score metric */}
              <div className="p-4 bg-[#252525] rounded-xl border border-[#2A2A2A] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="text-[#8B5CF6] w-6 h-6" />
                  <div>
                    <div className="text-sm text-gray-400">Current Score</div>
                    <div className="text-xl font text-white">
                      {dashboardData.resumeHealth.score}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvements needed metric */}
              <div className="p-4 bg-[#252525] rounded-xl border border-[#2A2A2A] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="text-gray-400 w-6 h-6" />
                  <div>
                    <div className="text-sm text-gray-400">Improvements</div>
                    <div className="text-xl font-semibold text-white">
                      {dashboardData.resumeHealth.improvements}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action button with dark theme styling */}
            <Link
              href="/platform/features/resume-optimizer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#252525] text-white rounded-[6px] hover:bg-[#2A2A2A] transition-all text-sm font-medium border border-[#2A2A2A] hover:border-[#333333] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:translate-y-[-1px]"
            >
              Optimize Resume Now
            </Link>
          </div>

          {/* ===== QUICK ACTIONS CARD ===== */}
          <div className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative">
            {/* Background texture and subtle gradient */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full filter blur-3xl"></div>

            <h2 className="text-lg font mb-6 flex items-center gap-3 text-white relative">
              {/* Card icon with green accent */}
              <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#22C55E]">
                <FiZap className="w-5 h-5" />
              </div>
              Quick Actions
            </h2>

            {/* Quick action buttons list */}
            <div className="grid grid-cols-1 gap-3">
              {staticQuickActions.map((action, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group relative"
                >
                  {/* Individual action button with hover effects */}
                  <Link
                    href={action.link}
                    className="p-3 rounded-xl flex items-center gap-3 bg-[#252525] hover:bg-[#2A2A2A] transition-all border border-[#2A2A2A] hover:border-[#22C55E]/30 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.15)]"
                  >
                    {/* Action icon with color from props */}
                    <div className="p-1.5 rounded-xl text-[#22C55E]">
                      {React.cloneElement(action.icon as React.ReactElement, {
                        className: "w-5 h-5",
                      })}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {action.title}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== LEARNING PATHWAYS COMPONENT ===== */}
          <LearningPathwaysPreview
            paths={dashboardData.learningPaths.map(
              (p: { title: string; progress: number; icon?: ReactNode }) => ({
                ...p,
                icon: p.icon || <FiLayers className="w-5 h-5" />,
              })
            )}
          />

          {/* ===== INTERVIEW PREP CARD ===== */}
          <div className="md:col-span-1 bg-[#161616] text-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] overflow-hidden relative">
            {/* Background texture and gradient */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/10 rounded-full filter blur-3xl"></div>

            {/* Card header with orange accent */}
            <h2 className="text-lg font mb-6 flex items-center gap-3 relative">
              <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#F97316]">
                <FiCalendar className="w-5 h-5" />
              </div>
              Interview Prep
            </h2>

            {/* Action button with dark theme styling */}
            <Link
              href="/platform/features/interview-prep"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#252525] text-white rounded-[6px] hover:bg-[#2A2A2A] transition-all text-sm font-medium border border-[#2A2A2A] hover:border-[#333333] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] hover:translate-y-[-1px]"
            >
              Start Practice
            </Link>
          </div>
        </div>

        {/* ===== USER PROFILE SIDEBAR ===== */}
        <div className="xl:w-80 bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] h-fit overflow-hidden relative">
          {/* Background texture and subtle gradient */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full filter blur-3xl"></div>

          {/* User profile header */}
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#22C55E]">
              <FiUser className="w-5 h-5" />
            </div>
            <h2 className="text-lg font text-white">
              {dashboardData.user.name}
            </h2>
          </div>

          {/* Feature activity section */}
          <div className="space-y-6 relative">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Feature Activity
            </h3>

            {/* Feature activity list */}
            <div className="space-y-3">
              {Object.entries(dashboardData.user.featureUsage).map(
                ([feature, count]) => (
                  <motion.div
                    key={feature}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="flex items-center justify-between p-3 bg-[#252525] rounded-xl border border-[#2A2A2A] hover:border-[#22C55E]/30 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.15)]"
                  >
                    {/* Feature name */}
                    <span className="text-sm text-gray-300 font-medium capitalize">
                      {feature.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>

                    {/* Usage count badge */}
                    <span className="text-sm font-semibold text-white bg-[#333333] px-2.5 py-1 rounded-xl shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
                      {count as number}
                    </span>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
