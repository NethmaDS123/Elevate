// components/Benefits.tsx (Enhanced)
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
      title: "Time Optimization",
      description: "Reduce job search time with AI-powered automation",
      icon: ClockIcon,
      color: "text-purple-400",
    },
    {
      title: "Personalized Roadmaps",
      description: "Custom career paths based on your unique profile",
      icon: UserCircleIcon,
      color: "text-blue-400",
    },
    {
      title: "Skill Analytics",
      description: "Real-time analysis of your technical competencies",
      icon: PuzzlePieceIcon,
      color: "text-green-400",
    },
    {
      title: "AI Mentor",
      description: "24/7 guidance from our intelligent career assistant",
      icon: CpuChipIcon,
      color: "text-pink-400",
    },
  ];

  return (
    <section className="relative py-20 bg-gray-900 border-t border-gray-800">
      <div className="absolute inset-0 opacity-10 [background:radial-gradient(theme(colors.purple.500),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Strategic Advantages
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4">
            Leverage cutting-edge technology to gain a competitive edge in
            today's dynamic job market
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gray-800 rounded-3xl transform group-hover:scale-105 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100" />

                <div className="relative p-8 h-full bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 group-hover:border-purple-500 transition-all">
                  <div className={`mb-6 ${benefit.color} transition-colors`}>
                    <Icon className="h-12 w-12" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {benefit.description}
                  </p>

                  <div className="absolute bottom-6 left-8 right-8">
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
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
      </div>
    </section>
  );
}
