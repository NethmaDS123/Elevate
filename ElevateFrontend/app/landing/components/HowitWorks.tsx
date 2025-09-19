"use client";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
// import { useRouter } from "next/navigation"; // Commented out as it's not used

export default function HowItWorks() {
  // const router = useRouter(); // Commented out as it's not used

  const steps = [
    {
      title: "Create Your Profile",
      description:
        "Sign up and select your career objectives, current skills, and target roles",
      icon: UserCircleIcon,
      accentColor: "#8B5CF6",
      features: ["Quick signup", "Role selection", "Skill assessment"],
    },
    {
      title: "Upload Your Materials",
      description:
        "Add resumes, projects, or job descriptions for personalized analysis",
      icon: DocumentTextIcon,
      accentColor: "#06B6D4",
      features: ["Resume upload", "Project portfolio", "Job matching"],
    },
    {
      title: "AI Analysis",
      description:
        "Real-time evaluation against market trends and industry standards",
      icon: SparklesIcon,
      accentColor: "#22C55E",
      features: ["ATS optimization", "Market insights", "Gap analysis"],
    },
    {
      title: "Optimized Results",
      description:
        "Personalized roadmap and resources tailored to your career goals",
      icon: ChartBarIcon,
      accentColor: "#F97316",
      features: ["Custom roadmap", "Learning paths", "Progress tracking"],
    },
  ];

  return (
    <section className="relative py-20 bg-white border-t border-gray-100 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-200 mb-8">
            <SparklesIcon className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-mono font-medium text-gray-600 tracking-wide uppercase">
              SIMPLE PROCESS
            </span>
          </div>

          <h2 className="mb-6">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-space font-bold leading-[1.1] text-black mb-1">
              How it works
            </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-serif font-normal leading-[1.2] text-gray-700 italic">
              in four simple steps
            </span>
          </h2>

          <p className="text-base font-inter text-gray-600 max-w-lg mx-auto leading-relaxed">
            From aspiring developer to industry professional with AI-powered
            guidance
          </p>
        </motion.div>

        <div className="relative">
          {/* Simplified connection line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 transform -translate-y-1/2"></div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -2 }}
                  className="relative group"
                >
                  {/* Step number indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white font-space font-bold text-xs">
                      {index + 1}
                    </div>
                  </motion.div>

                  {/* Card */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 p-5 pt-7 h-full relative overflow-hidden">
                    <div className="relative">
                      {/* Icon */}
                      <div className="inline-flex p-2.5 bg-gray-100 rounded mb-4">
                        <Icon className="h-4 w-4 text-gray-700" />
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-space font-semibold text-black mb-3">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm font-inter text-gray-600 mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Features list */}
                      <ul className="space-y-1.5">
                        {step.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-xs font-mono text-gray-500"
                          >
                            <CheckCircleIcon className="h-3 w-3 flex-shrink-0 text-gray-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
