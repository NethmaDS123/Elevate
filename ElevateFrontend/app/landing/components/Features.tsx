"use client";

import { motion } from "framer-motion";
// import { useRouter } from "next/navigation"; // Commented out as it's not used
import {
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CommandLineIcon,
  SparklesIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Resume Optimization",
    description:
      "AI-powered resume analysis with keyword optimization, ATS compatibility checks, and format enhancement according to job descriptions.",
    accentColor: "#8B5CF6",
    icon: DocumentTextIcon,
    href: "/platform/features/resume-optimizer",
    stats: "95% ATS Pass Rate",
  },
  {
    title: "Cover Letter Generation",
    description:
      "AI-powered cover letter creation tailored to specific job postings with personalized content that highlights your strengths.",
    accentColor: "#06B6D4",
    icon: EnvelopeIcon,
    href: "/platform/features/cover-letters",
    stats: "Highly Personlized",
  },
  {
    title: "Project Evaluation",
    description:
      "Smart assessment of project relevance with complexity scoring and improvement recommendations for your portfolio.",
    accentColor: "#22C55E",
    icon: BriefcaseIcon,
    href: "/platform/features/project-evaluation",
    stats: "10x Better Projects",
  },
  {
    title: "Learning Pathways",
    description:
      "Personalized learning tracks with curated resources for technical subjects tailored to your career goals.",
    accentColor: "#F97316",
    icon: AcademicCapIcon,
    href: "/platform/features/learning-paths",
    stats: "100+ Skill Paths",
  },
  {
    title: "Interview Preparation",
    description:
      "Technical and behavioral interview preparation tool to help you ace your job interviews with confidence.",
    accentColor: "#EF4444",
    icon: ChatBubbleLeftRightIcon,
    href: "/platform/features/interview-prep",
    stats: "Indepth Preparation",
  },
  {
    title: "Project Ideas",
    description:
      "Personalized project recommendations based on your skill level, career goals, and current market trends to build an impressive portfolio.",
    accentColor: "#6366F1",
    icon: LightBulbIcon,
    href: "/platform/features/project-ideas",
    stats: "Smart Suggestions",
  },
  {
    title: "Job Application Tracking",
    description:
      "Modern application tracking system that replaces Excel spreadsheets with real-time status updates, interview scheduling, and progress analytics.",
    accentColor: "#10B981",
    icon: BriefcaseIcon,
    href: "/platform/features/job-tracker",
    stats: "Replace Excel",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Compare your resume with ideal candidates in your position and get personalized roadmaps to bridge the gaps and reach your goals.",
    accentColor: "#8B5CF6",
    icon: CommandLineIcon,
    href: "/platform/features/skill-gap-analysis",
    stats: "Targeted Growth",
  },
];

export default function Features() {
  // const router = useRouter(); // Commented out as it's not used

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md border border-gray-200 mb-8">
            <SparklesIcon className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-mono font-medium text-gray-600 tracking-wide uppercase">
              COMPREHENSIVE TOOLKIT
            </span>
          </div>

          <h2 className="mb-6">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-space font-bold leading-[1.1] text-black mb-1">
              Complete career
            </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-serif font-normal leading-[1.2] text-gray-700 italic">
              development suite
            </span>
          </h2>

          <p className="text-base font-inter text-gray-600 leading-relaxed">
            AI-powered tools designed for ambitious developers entering
            competitive tech roles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className={`group relative h-full ${
                  index === 7 ? "lg:col-start-2" : ""
                }`}
              >
                {/* Card container */}
                <div className="relative h-full bg-white rounded-lg border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 p-5 overflow-hidden">
                  <div className="relative h-full flex flex-col">
                    {/* Icon and stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-gray-100 rounded">
                        <Icon className="h-4 w-4 text-gray-700" />
                      </div>
                      {feature.stats && (
                        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wide">
                          {feature.stats}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-space font-semibold text-black mb-2">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm font-inter text-gray-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
