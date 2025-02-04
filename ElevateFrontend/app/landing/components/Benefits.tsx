"use client";
import { motion } from "framer-motion";
import {
  ClockIcon,
  UserCircleIcon,
  PuzzlePieceIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

export default function Benefits() {
  const benefits = [
    {
      title: "Time-Saving",
      description: "Get actionable insights in minutes, not hours",
      icon: ClockIcon,
      color: "text-purple-600",
    },
    {
      title: "Personalized Insights",
      description: "Tailored recommendations for your career stage",
      icon: UserCircleIcon,
      color: "text-blue-600",
    },
    {
      title: "Comprehensive Support",
      description: "End-to-end career development platform",
      icon: PuzzlePieceIcon,
      color: "text-green-600",
    },
    {
      title: "AI-Powered Tools",
      description: "Cutting-edge technology for competitive edge",
      icon: CpuChipIcon,
      color: "text-pink-600",
    },
  ];

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 opacity-10 [background:radial-gradient(theme(colors.gray.400),theme(colors.gray.50))]" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Elevate Your Advantage
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your career trajectory with intelligent tools designed for
            modern professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-white shadow-lg transition-all duration-300 ease-out group-hover:shadow-xl" />

                <div className="relative p-8 h-full">
                  <div
                    className={`mb-6 transition-colors duration-300 ${benefit.color}`}
                  >
                    <Icon className="h-12 w-12" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>

                  <div className="mt-6">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full ${benefit.color.replace(
                          "text",
                          "bg"
                        )}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 italic">
            "The average user saves 12+ hours per week while improving their
            interview success rate"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
