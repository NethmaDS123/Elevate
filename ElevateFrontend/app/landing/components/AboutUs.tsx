"use client";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AboutSection() {
  const pillars = [
    {
      title: "Bridge the Gap",
      description: "Connect academic learning with industry requirements",
      icon: AcademicCapIcon,
      color: "text-purple-400",
    },
    {
      title: "AI-Driven Optimization",
      description: "Smart analysis of your professional assets",
      icon: SparklesIcon,
      color: "text-blue-400",
    },
    {
      title: "Career Acceleration",
      description: "Targeted skill development for market needs",
      icon: ChartBarIcon,
      color: "text-green-400",
    },
    {
      title: "Industry Alignment",
      description: "Real-world project evaluation and feedback",
      icon: BriefcaseIcon,
      color: "text-pink-400",
    },
  ];

  return (
    <section className="relative py-20 bg-gray-900 border-t border-gray-800">
      <div className="absolute inset-0 opacity-5 bg-[url('/assets/grid-pattern.svg')]" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
            Bridging the Academic-Industry Divide
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            At Elevate, we&apos;re transforming tech career development through
            integrated AI solutions that close the critical gap between academic
            preparation and industry demands.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-400 mb-6">
              Empower professionals to bridge the knowledge chasm between
              classroom learning and real-world tech industry requirements
              through intelligent, personalized career optimization.
            </p>
            <div className="h-px bg-gray-700 mb-6" />
            <p className="text-gray-400">
              By integrating resume analysis, skill benchmarking, project
              evaluation, and interview preparation into a unified AI-powered
              platform, we create seamless transitions from learning
              environments to competitive tech roles.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              The Elevate Advantage
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                AI-powered career path optimization
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                Real-time industry requirement analysis
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                Competency gap identification system
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                Dynamic interview simulation environment
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
              >
                <div className={`mb-4 ${pillar.color}`}>
                  <Icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-gray-400">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-16 text-center"
        ></motion.div>
      </div>
    </section>
  );
}
