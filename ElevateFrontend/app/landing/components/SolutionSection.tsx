// components/SolutionSection.tsx
"use client";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiTarget,
  FiLayers,
  FiClock,
  FiUserCheck,
  FiBarChart2,
} from "react-icons/fi";

export default function SolutionSection() {
  const solutions = [
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: "AI Integration",
      description:
        "Unified platform connecting all tech career development aspects",
      stats: "50% faster skill acquisition",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Skill Benchmarking",
      description: "Compare yourself against top candidates in the field",
      stats: "90% industry standard match",
      gradient: "from-blue-500 to-green-500",
    },
    {
      icon: <FiLayers className="w-6 h-6" />,
      title: "Project Validation",
      description: "Real-world project assessments for practical skills",
      stats: "35% better project quality",
      gradient: "from-green-500 to-yellow-500",
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Efficiency Engine",
      description: "Automated job preparation tools",
      stats: "Time savings of 60%",
      gradient: "from-yellow-500 to-pink-500",
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
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
            The Elevate Advantage
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Transforming theoretical knowledge into market-ready expertise
            through AI-driven integration
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Enhanced Interactive Feature Showcase */}
          <motion.div
            className="relative h-[400px] rounded-2xl overflow-hidden group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            whileHover={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
            <div className="absolute inset-0 [background-image:linear-gradient(to_bottom_right,transparent_60%,rgba(99,102,241,0.1))]" />

            <div className="relative h-full p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <FiBarChart2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Academic to Industry Bridge
                  </h3>
                </div>

                <p className="text-lg text-gray-300 max-w-md">
                  Our AI-powered translation engine converts theoretical
                  knowledge into market-ready skills
                </p>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  className="bg-gray-800/50 p-6 rounded-xl border border-purple-500/20 hover:border-purple-400 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <div className="text-2xl font-bold text-purple-400">
                      83%
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Faster skill adaptation rate
                  </p>
                </motion.div>

                <motion.div
                  className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/20 hover:border-blue-400 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <div className="text-2xl font-bold text-blue-400">4.9x</div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Interview success multiplier
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#4f46e512_1px,transparent_1px),linear-gradient(to_bottom,#4f46e512_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-500/10 blur-[80px]" />
          </motion.div>

          {/* Solution Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-full"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`}
                />
                <div className="relative h-full bg-gray-800/50 p-6 rounded-xl border border-gray-700 group-hover:border-purple-500 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${solution.gradient}`}
                    >
                      {solution.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {solution.title}
                      </h3>
                      <div className="text-sm font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {solution.stats}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {solution.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
        >
          <div className="absolute inset-0 [background:radial-gradient(theme(colors.purple.500),transparent_120%)] opacity-10" />
          <div className="relative grid md:grid-cols-4 gap-8">
            {[
              "Academic Foundation",
              "Skill Translation",
              "Industry Alignment",
              "Career Success",
            ].map((step, index) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                  {index + 1}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {step}
                </h4>
                <p className="text-gray-400 text-sm">
                  {
                    [
                      "CS Degree Fundamentals",
                      "AI-Powered Skill Mapping",
                      "Real-World Project Validation",
                      "Competitive Job Placement",
                    ][index]
                  }
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
