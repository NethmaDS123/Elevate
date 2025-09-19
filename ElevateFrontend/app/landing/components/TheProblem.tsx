"use client";
import { motion } from "framer-motion";
import {
  FiBook,
  FiFile,
  FiCode,
  FiUserX,
  FiPieChart,
  FiAlertTriangle,
} from "react-icons/fi";

export default function TheProblem() {
  const painPoints = [
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Academic vs Industry Gap",
      description:
        "Classroom knowledge doesn't translate to practical development requirements and real-world challenges",
      accentColor: "#EF4444",
      stat: "78% skill mismatch",
    },
    {
      icon: <FiFile className="w-6 h-6" />,
      title: "Generic Resume Advice",
      description:
        "One-size-fits-all approaches fail to address tech-specific requirements and ATS optimization",
      accentColor: "#F97316",
      stat: "43% ATS rejection",
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      title: "Project Experience Void",
      description:
        "Limited exposure to real-world system design and industry-standard development practices",
      accentColor: "#EAB308",
      stat: "62% lack portfolio",
    },
    {
      icon: <FiUserX className="w-6 h-6" />,
      title: "Interview Preparation Deficit",
      description:
        "Insufficient technical interview practice and lack of structured feedback mechanisms",
      accentColor: "#8B5CF6",
      stat: "69% interview anxiety",
    },
    {
      icon: <FiPieChart className="w-6 h-6" />,
      title: "Fragmented Resources",
      description:
        "Disconnected tools and platforms for different aspects of career development and job preparation",
      accentColor: "#06B6D4",
      stat: "5+ tools average",
    },
  ];

  return (
    <section className="relative py-20 bg-gray-50 border-t border-gray-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md border border-gray-200 mb-8">
            <FiAlertTriangle className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-mono font-medium text-gray-600 tracking-wide uppercase">
              THE CHALLENGE
            </span>
          </div>

          <h2 className="mb-6">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-space font-bold leading-[1.1] text-black mb-1">
              The preparation
            </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-serif font-normal leading-[1.2] text-gray-700 italic">
              gap problem
            </span>
          </h2>

          <p className="text-base font-inter text-gray-600 max-w-lg mx-auto leading-relaxed">
            CS programs teach theory, but industry demands practical skills and
            real-world experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="group relative h-full"
            >
              <div className="bg-white rounded-lg border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 p-5 h-full relative overflow-hidden">
                <div className="relative">
                  {/* Icon and stat */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-gray-100 rounded">
                      <div className="text-gray-700">{point.icon}</div>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase tracking-wide">
                      {point.stat}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-space font-semibold text-black mb-3">
                    {point.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm font-inter text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
