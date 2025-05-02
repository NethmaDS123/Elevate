// components/ProblemSection.tsx
"use client";
import { motion } from "framer-motion";
import { FiBook, FiFile, FiCode, FiUserX, FiPieChart } from "react-icons/fi";

export default function ProblemSection() {
  const painPoints = [
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Academic vs Industry Gap",
      description: "Classroom knowledge ≠ practical development requirements",
    },
    {
      icon: <FiFile className="w-6 h-6" />,
      title: "Generic Resume Advice",
      description: "One-size-fits-all approaches fail tech-specific needs",
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      title: "Project Experience Void",
      description: "Limited real-world system design opportunities",
    },
    {
      icon: <FiUserX className="w-6 h-6" />,
      title: "Interview Preparation Deficit",
      description: "Lack of technical interview practice and feedback",
    },
    {
      icon: <FiPieChart className="w-6 h-6" />,
      title: "Fragmented Resources",
      description: "Disconnected tools for different career aspects",
    },
  ];

  return (
    <section className="relative py-20 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
            The Tech Career Gap
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            While computer science programs provide foundational knowledge,
            graduates face critical hurdles when entering competitive tech
            roles:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
            >
              <div className="text-purple-400 mb-4">{point.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {point.title}
              </h3>
              <p className="text-gray-400 text-sm">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/20 inline-block">
            <p className="text-xl text-gray-300 mb-4">
              83% of CS graduates feel unprepared for technical interviews
            </p>
            <p className="text-sm text-gray-500">
              *2023 Tech Career Preparedness Survey
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
