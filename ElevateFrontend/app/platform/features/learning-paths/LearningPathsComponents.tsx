"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen,
  FiLoader,
  FiPlay,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiChevronRight,
  FiExternalLink,
  FiCode,
  FiAward,
  FiClock,
  FiZap,
  FiStar,
  FiCheckCircle,
  FiDollarSign,
  FiGift,
  FiMapPin,
  FiLayers,
  FiTool,
  FiGitBranch,
  FiBriefcase,
  FiMonitor,
  FiBook,
  FiVideo,
  FiFileText,
  FiGlobe,
  FiCalendar,
  FiBarChart,
  FiFlag,
  FiLink,
  FiShield,
  FiAlertCircle,
  FiSave,
  FiHeart,
} from "react-icons/fi";
import {
  Pathway,
  Step,
  Topic,
  Resource,
  Project,
  MilestoneProject,
  IndustryReadiness,
  ContinuousLearning,
  Community,
  Certification,
  exampleTopics,
} from "./LearningPathsLogic";

// ------------------
// Utility Functions
// ------------------

function getResourceIcon(type: string) {
  switch (type) {
    case "Course":
      return FiVideo;
    case "Book":
      return FiBook;
    case "Tutorial":
      return FiMonitor;
    case "Documentation":
      return FiFileText;
    case "Video":
      return FiPlay;
    default:
      return FiLink;
  }
}

function getSkillLevelColor(level: string) {
  switch (level) {
    case "Beginner":
      return "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20";
    case "Intermediate":
      return "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20";
    case "Advanced":
      return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  }
}

// ------------------
// Loading and State Components
// ------------------

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <FiLoader className="animate-spin h-8 w-8 text-[#8B5CF6]" />
    </div>
  );
}

export function UnauthenticatedState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <p className="text-lg font-medium text-gray-300">
        Please log in to access Learning Pathways.
      </p>
    </div>
  );
}

// ------------------
// Header Component
// ------------------

export function LearningPathsHeader() {
  return (
    <header className="text-center mb-16 relative">
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
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Learning Pathways
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Structured roadmaps for mastering complex technical domains
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-6 mt-6"
        >
          {/* Quick Action Button */}
          <motion.a
            href="/platform/features/saved-learning-paths"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl font-semibold text-sm shadow-lg transition-all duration-200"
          >
            <FiHeart className="w-4 h-4" />
            View Saved Pathways
          </motion.a>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="p-1.5 bg-[#8B5CF6]/20 rounded-lg">
                <FiZap className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <span className="text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="p-1.5 bg-[#22C55E]/20 rounded-lg">
                <FiAward className="w-4 h-4 text-[#22C55E]" />
              </div>
              <span className="text-sm">Industry-Ready</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="p-1.5 bg-[#F97316]/20 rounded-lg">
                <FiStar className="w-4 h-4 text-[#F97316]" />
              </div>
              <span className="text-sm">Expert-Curated</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}

// ------------------
// Search Form Component
// ------------------

interface SearchFormProps {
  searchTopic: string;
  setSearchTopic: (topic: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export function SearchForm({
  searchTopic,
  setSearchTopic,
  handleSearchSubmit,
  loading,
  error,
}: SearchFormProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.form
      onSubmit={handleSearchSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <motion.div
          className={`relative flex-1 transition-all duration-300 ${
            isFocused ? "scale-[1.02]" : ""
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#22C55E]/20 rounded-2xl blur-xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
          <FiBookOpen
            className={`h-6 w-6 absolute right-6 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
              isFocused ? "text-[#8B5CF6]" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter a technical topic (e.g., Computer Science, Machine Learning)"
            className="w-full px-6 py-4 border-2 border-[#333333] bg-[#252525] rounded-2xl focus:border-[#8B5CF6] focus:ring-4 focus:ring-[#8B5CF6]/20 placeholder-gray-500 text-lg text-white transition-all duration-200 relative z-10"
          />
        </motion.div>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="px-8 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-semibold transition-all duration-200 md:w-52 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <FiLoader className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FiZap className="h-5 w-5" />
                Generate Pathway
              </>
            )}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-4 bg-red-500/10 rounded-xl flex items-center gap-3 border border-red-500/20 backdrop-blur-sm"
          >
            <div className="p-2 bg-red-500/20 rounded-full">
              <FiTarget className="h-5 w-5 text-red-400 flex-shrink-0" />
            </div>
            <span className="text-red-400 font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

// ------------------
// Example Topics Component
// ------------------

interface ExampleTopicsProps {
  handleExampleClick: (topic: string) => void;
}

export function ExampleTopics({ handleExampleClick }: ExampleTopicsProps) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  // Group topics by category for better organization
  const categorizedTopics = {
    Programming: [
      "Computer Science",
      "Data Structures",
      "Algorithms",
      "Web Development",
    ],
    "Data & AI": ["Data Science", "Machine Learning", "AI"],
    Systems: [
      "Computer Architecture",
      "Operating Systems",
      "Distributed Systems",
      "Databases",
    ],
    Specialized: [
      "Cybersecurity",
      "DevOps",
      "Blockchain",
      "Cloud Computing",
      "Software Engineering",
    ],
  };

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Popular Learning Paths
        </h3>
        <p className="text-gray-400">
          Click on any topic to get started instantly
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(categorizedTopics).map(
          ([category, topics], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + categoryIndex * 0.1 }}
              className="space-y-3"
            >
              <h4 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-[#8B5CF6] to-[#22C55E] rounded-full" />
                {category}
              </h4>
              <div className="flex flex-wrap gap-3">
                {topics.map((topic, index) => (
                  <motion.button
                    key={topic}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 1 + categoryIndex * 0.1 + index * 0.05,
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -3,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExampleClick(topic)}
                    onMouseEnter={() => setHoveredTopic(topic)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    className="group relative px-5 py-3 bg-[#252525] text-gray-300 rounded-xl border-2 border-[#333333] hover:border-[#8B5CF6]/50 hover:bg-[#2A2A2A] transition-all duration-200 font-medium shadow-sm overflow-hidden"
                  >
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#22C55E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    <span className="relative z-10 flex items-center gap-2">
                      {topic}
                      <FiChevronRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          hoveredTopic === topic ? "translate-x-1" : ""
                        }`}
                      />
                    </span>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}

// ------------------
// Enhanced Resource Components
// ------------------

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

function ResourceCard({ resource, index }: ResourceCardProps) {
  const IconComponent = getResourceIcon(resource.type);

  // Check for fake URLs and create Google search link
  const isFakeUrl =
    resource.url.includes("example.com") ||
    resource.url.includes("actual-url.com") ||
    resource.url.includes("placeholder") ||
    resource.url === "https://example.com" ||
    !resource.url.startsWith("http");

  // Create Google search URL for fake URLs or use original URL for real ones
  const searchQuery = encodeURIComponent(
    `${resource.title} ${resource.type} tutorial course`
  );
  const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
  const finalUrl = isFakeUrl ? googleSearchUrl : resource.url;

  return (
    <motion.a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group block p-3 rounded-lg border transition-all duration-200 bg-[#252525] border-[#2A2A2A] hover:border-[#8B5CF6]/50"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-[#8B5CF6]/20 rounded-lg flex-shrink-0">
          <IconComponent className="w-3 h-3 text-[#8B5CF6]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h6 className="text-white font-medium text-sm leading-tight">
              {resource.title}
            </h6>
            {isFakeUrl ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-xs">
                <FiGlobe className="w-3 h-3" />
                Search Google
              </span>
            ) : resource.free ? (
              <span className="inline-flex items-center px-1.5 py-0.5 bg-[#22C55E]/10 text-[#22C55E] rounded text-xs">
                Free
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 bg-[#F97316]/10 text-[#F97316] rounded text-xs">
                Paid
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {resource.duration}
            </span>
            <span>•</span>
            <span>{resource.type}</span>
            {isFakeUrl && (
              <>
                <span>•</span>
                <span className="text-[#8B5CF6]">Google Search</span>
              </>
            )}
          </div>
        </div>

        <FiExternalLink className="w-3 h-3 text-gray-400 group-hover:scale-110 transition-transform flex-shrink-0" />
      </div>
    </motion.a>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 bg-[#1A1A1A] rounded-lg border border-[#333333] hover:border-[#F97316]/50 transition-all duration-200 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/5 to-[#EA580C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F97316]/20 rounded-lg">
              <FiCode className="w-4 h-4 text-[#F97316]" />
            </div>
            <div>
              <h6 className="text-white font-medium text-sm">
                {project.title}
              </h6>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs border ${getSkillLevelColor(
                    project.difficulty
                  )}`}
                >
                  {project.difficulty}
                </span>
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  {project.estimated_time}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-[#333333] rounded transition-colors"
          >
            <FiChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-3 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {project.skills_used.slice(0, 3).map((skill, si) => (
            <span
              key={si}
              className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {project.skills_used.length > 3 && (
            <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs">
              +{project.skills_used.length - 3} more
            </span>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[#333333] pt-3 mt-3 space-y-3"
            >
              <div>
                <h6 className="text-gray-300 text-xs font-medium mb-2 block">
                  All Skills Used:
                </h6>
                <div className="flex flex-wrap gap-1">
                  {project.skills_used.map((skill, si) => (
                    <span
                      key={si}
                      className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {project.github_search_terms.length > 0 && (
                <div>
                  <h6 className="text-gray-300 text-xs font-medium mb-2 block">
                    GitHub Search Terms:
                  </h6>
                  <div className="flex flex-wrap gap-1">
                    {project.github_search_terms.map((term, ti) => (
                      <span
                        key={ti}
                        className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs font-mono"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ------------------
// Enhanced Topic Card Component
// ------------------

interface TopicCardProps {
  topic: Topic;
  index: number;
  stepIndex: number;
  topicIndex: number;
  expandedTopic: string | null;
  setExpandedTopic: (id: string | null) => void;
}

function TopicCard({
  topic,
  index,
  stepIndex,
  topicIndex,
  expandedTopic,
  setExpandedTopic,
}: TopicCardProps) {
  const topicId = `step-${stepIndex}-topic-${topicIndex}`;
  const isExpanded = expandedTopic === topicId;

  const handleToggle = () => {
    setExpandedTopic(isExpanded ? null : topicId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[#161616] rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#2A2A2A] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] relative overflow-hidden"
    >
      {/* Background texture and subtle gradient */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dimension.png')]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full filter blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2.5 bg-[#252525] rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-[#8B5CF6] flex-shrink-0">
              <FiCode className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-white leading-tight">
              {topic.name}
            </h4>
          </div>
          <motion.button
            onClick={handleToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-[#252525] rounded-lg hover:bg-[#2A2A2A] transition-colors border border-[#2A2A2A] flex-shrink-0"
          >
            <FiChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </motion.button>
        </div>

        {/* Always visible summary */}
        <div className="grid grid-cols-3 gap-4 text-center mb-4 min-h-[80px]">
          <div className="p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <div className="text-lg font-semibold text-white">
              {topic.subtopics?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Topics</div>
          </div>
          <div className="p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <div className="text-lg font-semibold text-white">
              {topic.resources?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Resources</div>
          </div>
          <div className="p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <div className="text-lg font-semibold text-white">
              {topic.projects?.length || 0}
            </div>
            <div className="text-xs text-gray-400">Projects</div>
          </div>
        </div>

        {/* Why Important - Always visible if available */}
        {topic.why_important && (
          <div className="mb-4 p-3 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <p className="text-gray-300 text-sm leading-relaxed">
              {topic.why_important}
            </p>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 border-t border-[#2A2A2A] pt-4"
            >
              {/* Subtopics & Concepts */}
              {((topic.subtopics?.length || 0) > 0 ||
                (topic.concepts_to_master?.length || 0) > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(topic.subtopics?.length || 0) > 0 && (
                    <div className="p-4 bg-[#252525] rounded-lg border border-[#2A2A2A]">
                      <h5 className="font-medium text-gray-300 mb-3 flex items-center gap-2 text-sm">
                        <FiTarget className="w-4 h-4 text-[#8B5CF6]" />
                        Subtopics
                      </h5>
                      <div className="space-y-1">
                        {(topic.subtopics || []).map((sub, si) => (
                          <div
                            key={si}
                            className="flex items-start gap-2 text-gray-400 text-sm"
                          >
                            <FiCheckCircle className="w-3 h-3 text-[#22C55E] flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(topic.concepts_to_master?.length || 0) > 0 && (
                    <div className="p-4 bg-[#252525] rounded-lg border border-[#2A2A2A]">
                      <h5 className="font-medium text-gray-300 mb-3 flex items-center gap-2 text-sm">
                        <FiLayers className="w-4 h-4 text-[#22C55E]" />
                        Key Concepts
                      </h5>
                      <div className="space-y-1">
                        {(topic.concepts_to_master || []).map((concept, ci) => (
                          <div
                            key={ci}
                            className="flex items-start gap-2 text-gray-400 text-sm"
                          >
                            <FiStar className="w-3 h-3 text-[#22C55E] flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{concept}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Resources */}
              {(topic.resources?.length || 0) > 0 && (
                <div>
                  <h5 className="font-medium text-gray-300 mb-3 flex items-center gap-2 text-sm">
                    <FiBookOpen className="w-4 h-4 text-[#22C55E]" />
                    Learning Resources
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {(Array.isArray(topic.resources)
                      ? topic.resources
                      : []
                    ).map((resource, ri) => {
                      // Handle both old string format and new object format
                      if (typeof resource === "string") {
                        // Create Google search for string resources
                        const searchQuery = encodeURIComponent(resource);
                        const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;

                        return (
                          <motion.a
                            key={ri}
                            href={googleSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: ri * 0.02 }}
                            whileHover={{ scale: 1.01 }}
                            className="group block p-3 bg-[#252525] rounded-lg border border-[#2A2A2A] hover:border-[#22C55E]/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <FiGlobe className="w-3 h-3 text-[#22C55E] flex-shrink-0 group-hover:scale-110 transition-transform" />
                              <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                                {resource}
                              </span>
                            </div>
                          </motion.a>
                        );
                      }
                      return (
                        <ResourceCard key={ri} resource={resource} index={ri} />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Practice Resources */}
              {(topic.practice_resources?.length || 0) > 0 && (
                <div>
                  <h5 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                    <FiTool className="w-4 h-4 text-[#F97316]" />
                    Practice Platforms
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(topic.practice_resources || []).map((practice, pi) => (
                      <motion.a
                        key={pi}
                        href={practice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: pi * 0.05 }}
                        whileHover={{ y: -2, scale: 1.02 }}
                        className="group block p-3 bg-[#1A1A1A] rounded-lg border border-[#333333] hover:border-[#F97316]/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#F97316]/20 rounded-lg">
                            <FiTool className="w-4 h-4 text-[#F97316]" />
                          </div>
                          <div className="flex-1">
                            <h6 className="text-white font-medium text-sm">
                              {practice.title}
                            </h6>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              {practice.description}
                            </p>
                          </div>
                          <FiExternalLink className="w-4 h-4 text-gray-400 group-hover:scale-110 transition-transform" />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(topic.projects || []).length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-300 mb-3 flex items-center gap-2 text-sm">
                    <FiCode className="w-4 h-4 text-[#F97316]" />
                    Project Ideas
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {(topic.projects || []).map((project, pi) => {
                      // Handle both old string format and new object format
                      if (typeof project === "string") {
                        return (
                          <div
                            key={pi}
                            className="p-3 bg-[#252525] rounded-lg border border-[#2A2A2A] flex items-center gap-2"
                          >
                            <FiStar className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                            <span className="text-sm text-gray-300 leading-relaxed">
                              {project}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <ProjectCard key={pi} project={project} index={pi} />
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ------------------
// Step Card Component
// ------------------

interface StepCardProps {
  step: Step;
  index: number;
  stepIndex: number;
  toggleItemCompletion: (itemId: string) => void;
  isItemCompleted: (itemId: string) => boolean;
  expandedStep: number | null;
  setExpandedStep: (stepIndex: number | null) => void;
}

function StepCard({
  step,
  index,
  stepIndex,
  toggleItemCompletion,
  isItemCompleted,
  expandedStep,
  setExpandedStep,
}: StepCardProps) {
  const isExpanded = expandedStep === stepIndex;
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const handleToggleStep = () => {
    setExpandedStep(isExpanded ? null : stepIndex);
    if (!isExpanded) {
      setExpandedTopic(null); // Reset topic expansion when collapsing step
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className="mb-12 relative"
    >
      {/* Connection line to next step */}
      {index < 5 && (
        <div className="absolute left-6 top-20 w-px h-16 bg-gradient-to-b from-[#8B5CF6]/50 to-transparent" />
      )}

      <motion.div
        className="bg-[#161616] rounded-2xl p-8 border border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
        whileHover={{ y: -5 }}
      >
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#22C55E]/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Step header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#8B5CF6]/20 rounded-xl">
                <span className="text-[#8B5CF6] font-bold text-lg">
                  {step.step}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {step.title}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiClock className="w-4 h-4" />
                    <span className="text-base">{step.duration}</span>
                  </div>
                  {step.skill_level && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getSkillLevelColor(
                        step.skill_level
                      )}`}
                    >
                      {step.skill_level}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleToggleStep}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-[#252525] rounded-xl hover:bg-[#2A2A2A] transition-colors border border-[#333333]"
            >
              <FiChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </motion.button>
          </div>

          {/* Core Goals & Learning Outcomes - Always visible */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#8B5CF6]/10 p-6 rounded-xl border border-[#8B5CF6]/20">
              <h4 className="font-semibold text-[#8B5CF6] mb-4 flex items-center gap-2">
                <FiTarget className="w-4 h-4" />
                Core Goals
              </h4>
              <div className="space-y-3">
                {step.core_goals.map((goal, i) => {
                  const goalId = `step-${stepIndex}-goal-${i}`;
                  const isCompleted = isItemCompleted(goalId);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-[#1A1A1A] rounded-lg border border-[#333333] group cursor-pointer hover:border-[#8B5CF6]/30 transition-colors"
                      onClick={() => toggleItemCompletion(goalId)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? "bg-[#22C55E] border-[#22C55E]"
                            : "border-gray-400 group-hover:border-[#8B5CF6]"
                        }`}
                      >
                        {isCompleted && (
                          <FiCheckCircle className="w-3 h-3 text-white" />
                        )}
                      </motion.div>
                      <span
                        className={`text-sm transition-colors leading-relaxed ${
                          isCompleted
                            ? "text-gray-400 line-through"
                            : "text-gray-300"
                        }`}
                      >
                        {goal}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {(step.learning_outcomes?.length || 0) > 0 && (
              <div className="bg-[#22C55E]/10 p-6 rounded-xl border border-[#22C55E]/20">
                <h4 className="font-semibold text-[#22C55E] mb-4 flex items-center gap-2">
                  <FiFlag className="w-4 h-4" />
                  Learning Outcomes
                </h4>
                <div className="space-y-3">
                  {(step.learning_outcomes || []).map((outcome, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-[#1A1A1A] rounded-lg border border-[#333333]"
                    >
                      <FiAward className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm leading-relaxed">
                        {outcome}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden space-y-8"
              >
                {/* Learning Topics */}
                <div>
                  <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <FiBookOpen className="w-5 h-5 text-[#8B5CF6]" />
                    Learning Topics
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {step.topics.map((topic, ti) => (
                      <TopicCard
                        key={ti}
                        topic={topic}
                        index={ti}
                        stepIndex={stepIndex}
                        topicIndex={ti}
                        expandedTopic={expandedTopic}
                        setExpandedTopic={setExpandedTopic}
                      />
                    ))}
                  </div>
                </div>

                {/* Milestone Project */}
                {step.milestone_project && (
                  <div className="bg-[#F97316]/10 p-6 rounded-xl border border-[#F97316]/20">
                    <h4 className="font-semibold text-[#F97316] mb-4 flex items-center gap-2">
                      <FiStar className="w-5 h-5" />
                      Milestone Project
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-white font-medium mb-2">
                          {step.milestone_project.title}
                        </h5>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                          {step.milestone_project.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(step.milestone_project.deliverables?.length || 0) >
                          0 && (
                          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                            <h6 className="text-gray-300 font-medium mb-3 flex items-center gap-2">
                              <FiCheckCircle className="w-4 h-4 text-[#22C55E]" />
                              Deliverables
                            </h6>
                            <div className="space-y-2">
                              {(step.milestone_project.deliverables || []).map(
                                (deliverable, di) => (
                                  <div
                                    key={di}
                                    className="flex items-start gap-2 text-gray-400 text-sm"
                                  >
                                    <FiTarget className="w-3 h-3 text-[#22C55E]" />
                                    {deliverable}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {(step.milestone_project.skills_demonstrated?.length ||
                          0) > 0 && (
                          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
                            <h6 className="text-gray-300 font-medium mb-3 flex items-center gap-2">
                              <FiTool className="w-4 h-4 text-[#8B5CF6]" />
                              Skills Demonstrated
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {(
                                step.milestone_project.skills_demonstrated || []
                              ).map((skill, si) => (
                                <span
                                  key={si}
                                  className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Assessment Ideas */}
                {(step.assessment_ideas?.length || 0) > 0 && (
                  <div className="bg-[#8B5CF6]/10 p-6 rounded-xl border border-[#8B5CF6]/20">
                    <h4 className="font-semibold text-[#8B5CF6] mb-4 flex items-center gap-2">
                      <FiBarChart className="w-5 h-5" />
                      Self-Assessment Ideas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(step.assessment_ideas || []).map((assessment, ai) => (
                        <motion.div
                          key={ai}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: ai * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-[#1A1A1A] rounded-lg border border-[#333333]"
                        >
                          <FiCheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {assessment}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary when collapsed */}
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-6 text-sm text-gray-400 mt-4"
            >
              <span className="flex items-center gap-2">
                <FiBookOpen className="w-4 h-4" />
                {step.topics.length} learning topics
              </span>
              <span className="flex items-center gap-2">
                <FiCode className="w-4 h-4" />
                {step.topics.reduce(
                  (acc, topic) => acc + (topic.projects?.length || 0),
                  0
                )}{" "}
                projects
              </span>
              <span className="flex items-center gap-2">
                <FiExternalLink className="w-4 h-4" />
                {step.topics.reduce(
                  (acc, topic) => acc + (topic.resources?.length || 0),
                  0
                )}{" "}
                resources
              </span>
              <span className="flex items-center gap-2">
                <FiStar className="w-4 h-4" />1 milestone project
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}

// ------------------
// Pathway Display Component
// ------------------

interface PathwayDisplayProps {
  pathway: Pathway;
  toggleItemCompletion: (itemId: string) => void;
  isItemCompleted: (itemId: string) => boolean;
  getProgressStats: () => {
    completed: number;
    total: number;
    percentage: number;
  };
  onSavePathway?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export function PathwayDisplay({
  pathway,
  toggleItemCompletion,
  isItemCompleted,
  getProgressStats,
  onSavePathway,
  isSaving = false,
  isSaved = false,
}: PathwayDisplayProps) {
  const progressStats = getProgressStats();
  const [expandedStep, setExpandedStep] = useState<number | null>(0); // First step expanded by default
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-20 space-y-12"
    >
      <div className="bg-[#161616] rounded-3xl p-10 shadow-2xl border border-[#2A2A2A] relative overflow-hidden">
        {/* Enhanced background gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-80 h-80 bg-[#22C55E]/10 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#F97316]/5 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Enhanced Header */}
        <motion.div
          className="mb-12 relative z-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-[#252525] rounded-full border border-[#333333]">
            <FiStar className="w-5 h-5 text-[#F97316]" />
            <span className="text-gray-300 font-medium">
              Learning Pathway Generated
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {pathway.topic} Learning Pathway
          </h2>

          {pathway.overview && (
            <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              {pathway.overview}
            </p>
          )}

          {/* Save Pathway Button */}
          {onSavePathway && (
            <div className="flex justify-center mb-8">
              <motion.button
                onClick={onSavePathway}
                disabled={isSaving || isSaved}
                whileHover={{ scale: isSaving || isSaved ? 1 : 1.05 }}
                whileTap={{ scale: isSaving || isSaved ? 1 : 0.98 }}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
                  isSaved
                    ? "bg-[#22C55E] text-white cursor-default"
                    : isSaving
                    ? "bg-[#8B5CF6]/50 text-white cursor-not-allowed"
                    : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                }`}
              >
                {isSaving ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Saving Pathway...
                  </>
                ) : isSaved ? (
                  <>
                    <FiHeart className="w-5 h-5" />
                    Pathway Saved!
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    Save Learning Pathway
                  </>
                )}
              </motion.button>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-[#8B5CF6]" />
              <span>{pathway.timeline}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiTarget className="w-4 h-4 text-[#22C55E]" />
              <span>{pathway.steps.length} Steps</span>
            </div>
            <div className="flex items-center gap-2">
              <FiBookOpen className="w-4 h-4 text-[#F97316]" />
              <span>
                {pathway.steps.reduce(
                  (acc, step) => acc + step.topics.length,
                  0
                )}{" "}
                Topics
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiBarChart className="w-4 h-4 text-[#8B5CF6]" />
              <span>{progressStats.percentage}% Complete</span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          {progressStats.total > 0 && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Overall Progress</span>
                <span className="text-sm text-[#8B5CF6] font-medium">
                  {progressStats.completed} of {progressStats.total} completed
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
            </div>
          )}

          {/* Prerequisites & Career Outcomes */}
          {((pathway.prerequisites?.length || 0) > 0 ||
            (pathway.career_outcomes?.length || 0) > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {(pathway.prerequisites?.length || 0) > 0 && (
                <div className="bg-[#252525] p-6 rounded-xl border border-[#333333]">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <FiShield className="w-4 h-4 text-[#8B5CF6]" />
                    Prerequisites
                  </h4>
                  <div className="space-y-2">
                    {(pathway.prerequisites || []).map((prereq, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-gray-400 text-sm"
                      >
                        <FiCheckCircle className="w-3 h-3 text-[#8B5CF6]" />
                        {prereq}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(pathway.career_outcomes?.length || 0) > 0 && (
                <div className="bg-[#252525] p-6 rounded-xl border border-[#333333]">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4 text-[#22C55E]" />
                    Career Outcomes
                  </h4>
                  <div className="space-y-2">
                    {(pathway.career_outcomes || []).map((outcome, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-gray-400 text-sm"
                      >
                        <FiTarget className="w-3 h-3 text-[#22C55E]" />
                        {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <div className="relative z-10">
          {/* Progress indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Learning Journey
              </h3>
              <span className="text-sm text-gray-400">
                Click steps to expand details
              </span>
            </div>
            <div className="flex items-center gap-2">
              {pathway.steps.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-2 bg-[#333333] rounded-full overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.3, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#22C55E]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          {pathway.steps.map((step, index) => (
            <StepCard
              key={step.step}
              step={step}
              index={index}
              stepIndex={index}
              toggleItemCompletion={toggleItemCompletion}
              isItemCompleted={isItemCompleted}
              expandedStep={expandedStep}
              setExpandedStep={setExpandedStep}
            />
          ))}

          {/* Enhanced conclusion sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            {/* Industry Readiness */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#22C55E]/10 to-[#16A34A]/10 p-8 rounded-2xl border border-[#22C55E]/30 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#22C55E]/20 rounded-xl">
                    <FiUsers className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#22C55E]">
                    Industry Readiness
                  </h3>
                </div>
                <div className="space-y-4">
                  {(pathway.industry_readiness || []).map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]"
                    >
                      {typeof item === "string" ? (
                        <div className="flex items-start gap-3">
                          <FiCheckCircle className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <FiShield className="w-4 h-4 text-[#22C55E]" />
                            <span className="text-[#22C55E] font-medium text-sm">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                            {item.recommendation}
                          </p>
                          {(item.resources?.length || 0) > 0 && (
                            <div className="space-y-1">
                              {(item.resources || []).map((resource, ri) => (
                                <div
                                  key={ri}
                                  className="flex items-center gap-2 text-gray-400 text-xs"
                                >
                                  <FiLink className="w-3 h-3" />
                                  {resource}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Continuous Learning */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#F97316]/10 to-[#EA580C]/10 p-8 rounded-2xl border border-[#F97316]/30 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#F97316]/20 rounded-xl">
                    <FiTrendingUp className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F97316]">
                    Continuous Learning
                  </h3>
                </div>
                <div className="space-y-4">
                  {(pathway.continuous_learning || []).map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]"
                    >
                      {typeof item === "string" ? (
                        <div className="flex items-start gap-3">
                          <FiStar className="w-4 h-4 text-[#F97316] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <FiStar className="w-4 h-4 text-[#F97316]" />
                            <span className="text-[#F97316] font-medium text-sm">
                              {item.area}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="grid grid-cols-1 gap-3">
                            {(item.resources?.length || 0) > 0 && (
                              <div>
                                <h6 className="text-gray-400 text-xs font-medium mb-2">
                                  Resources:
                                </h6>
                                <div className="space-y-1">
                                  {(item.resources || []).map(
                                    (resource, ri) => (
                                      <div
                                        key={ri}
                                        className="flex items-center gap-2 text-gray-400 text-xs"
                                      >
                                        <FiLink className="w-3 h-3" />
                                        {resource}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                            {(item.communities?.length || 0) > 0 && (
                              <div>
                                <h6 className="text-gray-400 text-xs font-medium mb-2">
                                  Communities:
                                </h6>
                                <div className="space-y-1">
                                  {(item.communities || []).map(
                                    (community, ci) => (
                                      <div
                                        key={ci}
                                        className="flex items-center gap-2 text-gray-400 text-xs"
                                      >
                                        <FiUsers className="w-3 h-3" />
                                        {community}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Communities & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Communities */}
            {(pathway.communities_to_join?.length || 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-[#8B5CF6]/10 p-8 rounded-2xl border border-[#8B5CF6]/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#8B5CF6]/20 rounded-xl">
                    <FiUsers className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#8B5CF6]">
                    Communities to Join
                  </h3>
                </div>
                <div className="space-y-4">
                  {(pathway.communities_to_join || []).map((community, i) => (
                    <motion.a
                      key={i}
                      href={community.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="group block p-4 bg-[#1A1A1A] rounded-lg border border-[#333333] hover:border-[#8B5CF6]/50 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#8B5CF6]/20 rounded-lg">
                          <FiGlobe className="w-4 h-4 text-[#8B5CF6]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h6 className="text-white font-medium text-sm">
                              {community.name}
                            </h6>
                            <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs">
                              {community.platform}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs leading-relaxed">
                            {community.description}
                          </p>
                        </div>
                        <FiExternalLink className="w-4 h-4 text-gray-400 group-hover:scale-110 transition-transform" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {(pathway.certification_paths?.length || 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-[#F97316]/10 p-8 rounded-2xl border border-[#F97316]/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[#F97316]/20 rounded-xl">
                    <FiAward className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F97316]">
                    Certification Paths
                  </h3>
                </div>
                <div className="space-y-4">
                  {(pathway.certification_paths || []).map((cert, i) => (
                    <motion.a
                      key={i}
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + i * 0.1 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="group block p-4 bg-[#1A1A1A] rounded-lg border border-[#333333] hover:border-[#F97316]/50 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#F97316]/20 rounded-lg">
                          <FiAward className="w-4 h-4 text-[#F97316]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h6 className="text-white font-medium text-sm">
                              {cert.name}
                            </h6>
                            <span className="px-2 py-1 bg-gray-500/10 text-gray-400 rounded text-xs">
                              {cert.provider}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mb-2 leading-relaxed">
                            {cert.value}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[#F97316] text-xs font-medium">
                              {cert.cost}
                            </span>
                          </div>
                        </div>
                        <FiExternalLink className="w-4 h-4 text-gray-400 group-hover:scale-110 transition-transform" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-lg text-white font-medium shadow-lg transition-colors">
              <FiZap className="w-4 h-4" />
              <span>Ready to start your learning journey?</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
