"use client";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { ArrowPathIcon, CommandLineIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function HowItWorks() {
  const router = useRouter();

  const steps = [
    {
      title: "Create Your Profile",
      description: "Sign up and select your career objectives",
      icon: UserCircleIcon,
      color: "from-purple-500 to-blue-500",
      pattern: "pattern-1",
    },
    {
      title: "Upload Your Materials",
      description: "Add resumes, projects, or job descriptions",
      icon: DocumentTextIcon,
      color: "from-blue-500 to-green-500",
      pattern: "pattern-2",
    },
    {
      title: "AI Analysis",
      description: "Real-time evaluation against market trends",
      icon: SparklesIcon,
      color: "from-green-500 to-yellow-500",
      pattern: "pattern-3",
    },
    {
      title: "Optimized Results",
      description: "Personalized roadmap and resources",
      icon: ChartBarIcon,
      color: "from-pink-500 to-purple-500",
      pattern: "pattern-4",
    },
  ];

  return (
    <section className="relative py-20 bg-gray-900 border-t border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            Your Career Transformation Journey
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From academic foundations to industry-ready expertise in 4 steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Animated progress line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute left-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 transform -translate-x-1/2 hidden md:block origin-top"
          />

          <div className="grid md:grid-cols-2 gap-y-12 md:gap-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative ${!isEven ? "md:mt-24" : ""}`}
                >
                  {/* Desktop layout */}
                  <div className="hidden md:flex items-center gap-8">
                    {isEven && (
                      <div className="flex-1" aria-hidden="true">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="h-48 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center"
                        >
                          <CommandLineIcon className="w-16 h-16 text-gray-600 animate-pulse" />
                        </motion.div>
                      </div>
                    )}

                    <div
                      className={`w-1/2 ${isEven ? "text-right" : "text-left"}`}
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="relative group"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}
                        />

                        <div className="relative p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 hover:border-purple-500 transition-all">
                          <div
                            className={`mb-4 inline-block p-4 rounded-xl bg-gradient-to-br ${step.color}`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-400">{step.description}</p>
                          <div className="absolute top-6 -right-10">
                            <div className="w-8 h-8 bg-gray-900 border-2 border-purple-500 rounded-full flex items-center justify-center text-purple-400 font-bold">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {!isEven && (
                      <div className="flex-1" aria-hidden="true">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="h-48 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center"
                        >
                          <ArrowPathIcon className="w-16 h-16 text-gray-600 animate-spin" />
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden">
                    <div className="flex items-start gap-4 p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${step.color}`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {step.title}
                          </h3>
                          <span className="text-sm text-purple-400 font-bold">
                            0{index + 1}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => router.push("/signin")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-4 px-12 rounded-xl font-semibold shadow-xl hover:shadow-purple-500/20 transition-all flex items-center gap-2 mx-auto"
          >
            <CommandLineIcon className="w-5 h-5" />
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  );
}
