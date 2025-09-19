"use client";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiTarget,
  FiLayers,
  FiClock,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";

export default function SolutionSection() {
  const solutions = [
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: "AI Integration",
      description:
        "Unified platform connecting all tech career development aspects with intelligent automation",
      stats: "50% faster skill acquisition",
      accentColor: "#8B5CF6",
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Skill Benchmarking",
      description:
        "Compare yourself against top candidates in the field with real-time market data",
      stats: "90% industry standard match",
      accentColor: "#06B6D4",
    },
    {
      icon: <FiLayers className="w-6 h-6" />,
      title: "Project Validation",
      description:
        "Real-world project assessments for practical skills with industry feedback",
      stats: "35% better project quality",
      accentColor: "#22C55E",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Efficiency Engine",
      description:
        "Automated job preparation tools that streamline your entire application process",
      stats: "Time savings of 60%",
      accentColor: "#F97316",
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
            <FiZap className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-mono font-medium text-gray-600 tracking-wide uppercase">
              THE SOLUTION
            </span>
          </div>

          <h2 className="mb-6">
            <span className="block text-2xl md:text-3xl lg:text-4xl font-space font-bold leading-[1.1] text-black mb-1">
              The Elvte
            </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-serif font-normal leading-[1.2] text-gray-700 italic">
              advantage
            </span>
          </h2>

          <p className="text-base font-inter text-gray-600 max-w-lg mx-auto leading-relaxed">
            Transform theoretical knowledge into market-ready expertise with
            AI-driven acceleration
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Enhanced Interactive Feature Showcase */}
          <motion.div
            className="relative h-[320px] rounded-lg overflow-hidden group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="bg-white rounded-lg border border-gray-200 h-full relative overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="relative h-full p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-100 rounded">
                      <FiBarChart2 className="w-5 h-5 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-space font-bold text-black">
                      Academic to Industry
                      <span className="block text-base font-serif italic text-gray-700">
                        Bridge
                      </span>
                    </h3>
                  </div>

                  <p className="text-sm font-inter text-gray-600 max-w-sm leading-relaxed">
                    AI-powered translation engine converts theoretical knowledge
                    into market-ready skills with personalized guidance
                  </p>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    className="bg-gray-50 p-3 rounded border border-gray-100 hover:border-gray-200 transition-all"
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <div className="text-lg font-space font-bold text-black">
                        83%
                      </div>
                    </div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wide">
                      Faster adaptation
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gray-50 p-3 rounded border border-gray-100 hover:border-gray-200 transition-all"
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      <div className="text-lg font-space font-bold text-black">
                        4.9x
                      </div>
                    </div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wide">
                      Success rate
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solution Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {solutions.map((solution, index) => (
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
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2.5 bg-gray-100 rounded">
                        <div className="text-gray-700">{solution.icon}</div>
                      </div>
                      <div>
                        <h3 className="text-sm font-space font-semibold text-black mb-1">
                          {solution.title}
                        </h3>
                        <div className="text-xs font-mono font-medium text-gray-600 uppercase tracking-wide">
                          {solution.stats}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-inter text-gray-600 leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative bg-white rounded-lg p-6 border border-gray-200 overflow-hidden"
        >
          <div className="relative grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Academic Foundation",
                description: "CS Degree Fundamentals",
              },
              {
                title: "Skill Translation",
                description: "AI-Powered Mapping",
              },
              {
                title: "Industry Alignment",
                description: "Real-World Validation",
              },
              {
                title: "Career Success",
                description: "Job Placement",
              },
            ].map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white mb-3 mx-auto font-space font-bold text-xs">
                  {index + 1}
                </div>
                <h4 className="text-sm font-space font-semibold text-black mb-2">
                  {step.title}
                </h4>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wide">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
