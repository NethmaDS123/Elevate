"use client";

import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ArrowsRightLeftIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    title: "Resume Optimization",
    description:
      "AI-powered resume analysis with keyword optimization, ATS compatibility checks, and format enhancement according to a job description.",
    gradient: "from-purple-600 to-blue-500",
    icon: DocumentTextIcon,
  },
  {
    title: "Project Evaluation",
    description:
      "Smart assessment of project relevance with complexity scoring and improvement recommendations.",
    gradient: "from-teal-500 to-cyan-400",
    icon: BriefcaseIcon,
  },
  {
    title: "Learning Pathways",
    description:
      "Personalized learning tracks with curated resources for technical subjects.",
    gradient: "from-green-500 to-lime-400",
    icon: AcademicCapIcon,
  },
  {
    title: "Interview Preparation",
    description:
      "Technical and Behavioral interview preperation tool to help ace your job interviews.",
    gradient: "from-pink-500 to-rose-400",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    title: "Role Transition",
    description: "Strategic career pivot planner with transition roadmaps.",
    gradient: "from-orange-500 to-amber-400",
    icon: ArrowsRightLeftIcon,
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Comparing your skills with the ideal candidate, market demands, identifying gaps, and suggesting resources.",
    gradient: "from-gray-600 to-slate-400",
    icon: CommandLineIcon,
  },
];
export default function Features() {
  return (
    <section className="relative py-20 bg-gray-900">
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#4a556012_1px,transparent_1px),linear-gradient(to_bottom,#4a556012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Elevate Your Career Toolkit
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Transform your job search with intelligent, AI-powered career
            advancement tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="group relative h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />

                <div className="relative h-full bg-gray-800 rounded-2xl border border-gray-700 group-hover:border-purple-500 shadow-xl shadow-gray-800/50 transition-all duration-300 p-6">
                  <div className="inline-flex items-center justify-center rounded-xl p-3 mb-6 bg-gradient-to-br from-purple-600 to-blue-500">
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-5">
                    {feature.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                    <span>Learn more</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
