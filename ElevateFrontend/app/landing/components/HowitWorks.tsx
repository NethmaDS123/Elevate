"use client";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorks() {
  const steps = [
    {
      title: "Create Your Profile",
      description: "Sign up and decide which features you want to use",
      icon: UserCircleIcon,
      color: "text-purple-400",
    },
    {
      title: "Upload Your Materials",
      description: "Add your resume, job preferences or Project descriptions",
      icon: DocumentTextIcon,
      color: "text-blue-400",
    },
    {
      title: "AI Analysis",
      description:
        "Our system evaluates your information against market trends using top AI models",
      icon: SparklesIcon,
      color: "text-green-400",
    },
    {
      title: "Get Optimized Results",
      description:
        "Receive personalized career roadmaps, feedback and resources",
      icon: ChartBarIcon,
      color: "text-pink-400",
    },
  ];

  return (
    <section className="relative py-20 bg-gray-900 border-t border-gray-800">
      <div className="absolute inset-0 opacity-5 bg-[url('/assets/grid-pattern.svg')] bg-repeat" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
            Transform Your Career in 4 Steps
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover how our AI-powered platform helps you achieve your
            professional goals
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 w-1 h-full bg-gray-800 transform -translate-x-1/2 hidden md:block" />

          <div className="grid md:grid-cols-2 gap-y-12 md:gap-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative ${!isEven ? "md:mt-24" : ""}`}
                >
                  {/* Desktop layout */}
                  <div className="hidden md:flex items-center gap-8">
                    {isEven && (
                      <div className="flex-1" aria-hidden="true">
                        <div className="h-48 bg-gray-800/50 rounded-xl border border-gray-700 animate-pulse" />
                      </div>
                    )}

                    <div
                      className={`w-1/2 ${isEven ? "text-right" : "text-left"}`}
                    >
                      <div className="inline-block relative group">
                        <div
                          className={`absolute inset-0 ${step.color.replace(
                            "text",
                            "bg"
                          )} blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
                        />

                        <div className="relative p-8 bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 hover:border-purple-500 transition-all">
                          <div className={`mb-4 ${step.color}`}>
                            <Icon className="h-12 w-12" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-400">{step.description}</p>
                          <div className="absolute top-6 -right-10 text-2xl font-bold text-gray-600">
                            0{index + 1}
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isEven && (
                      <div className="flex-1" aria-hidden="true">
                        <div className="h-48 bg-gray-800/50 rounded-xl border border-gray-700 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 ${step.color}`}>
                        <Icon className="h-8 w-8 mt-2" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                      <div className="text-gray-600 font-bold">
                        0{index + 1}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 text-center"
        ></motion.div>
      </div>
    </section>
  );
}
