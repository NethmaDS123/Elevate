"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiExternalLink,
  FiBriefcase,
  FiCode,
  FiGithub,
  FiClock,
} from "react-icons/fi";

// Type definitions
interface SkillMetric {
  name: string;
  current: number;
  target: number;
  priority: "high" | "medium" | "low";
}

interface GapItem {
  category: string;
  skill: string;
  gapLevel: "critical" | "significant" | "moderate";
  recommendedActions: string[];
  resources: {
    type: "course" | "project" | "article";
    title: string;
    url: string;
  }[];
}

interface ExperienceRequirement {
  type: "professional" | "project" | "open-source";
  description: string;
  duration?: string;
  exampleProjects?: string[];
}

interface RoadmapPhase {
  phase: number;
  title: string;
  timeline: string;
  skillsToAcquire: string[];
  projects: string[];
  milestones: string[];
}

export default function SkillBenchmarking() {
  const [selectedCategory, setSelectedCategory] = useState("technical");
  const [expandedGap, setExpandedGap] = useState<string | null>(null);

  // Mock data
  const skillMetrics: SkillMetric[] = [
    { name: "System Design", current: 3, target: 8, priority: "high" },
    { name: "Algorithms", current: 5, target: 9, priority: "high" },
    { name: "Cloud Architecture", current: 2, target: 7, priority: "medium" },
    { name: "CI/CD Pipelines", current: 4, target: 6, priority: "low" },
  ];

  const gapAnalysis: GapItem[] = [
    {
      category: "technical",
      skill: "Distributed Systems",
      gapLevel: "critical",
      recommendedActions: [
        "Study consistent hashing patterns",
        "Implement a distributed cache system",
        "Learn about consensus algorithms (Raft, Paxos)",
      ],
      resources: [
        { type: "course", title: "MIT Distributed Systems Course", url: "#" },
        { type: "project", title: "Build a Key-Value Store", url: "#" },
      ],
    },
  ];

  const experienceRequirements: ExperienceRequirement[] = [
    {
      type: "project",
      description: "End-to-end system design implementation",
      duration: "2-3 months",
      exampleProjects: [
        "Video streaming platform architecture",
        "Distributed task scheduler",
      ],
    },
  ];

  const learningRoadmap: RoadmapPhase[] = [
    {
      phase: 1,
      title: "Core Fundamentals",
      timeline: "Month 1-2",
      skillsToAcquire: [
        "Advanced Data Structures",
        "Complex System Design Patterns",
      ],
      projects: ["Design YouTube API", "Implement a search engine indexer"],
      milestones: [
        "Complete 10 system design problems",
        "Master 20+ pattern recognition",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Skill Benchmarking & Gap Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Compare your current skills with target requirements and get
            personalized recommendations
          </p>
        </div>

        {/* Comparison Dashboard */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Skill Profile */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Your Current Profile
              <span className="text-blue-600 ml-2 text-lg">
                (L3 Software Engineer)
              </span>
            </h2>
            <div className="space-y-4">
              {skillMetrics.map((metric) => (
                <div key={metric.name} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{metric.name}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        metric.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : metric.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {metric.priority} priority
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${(metric.current / metric.target) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-600 text-sm">
                      {metric.current}/{metric.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Profile */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Target Profile
              <span className="text-purple-600 ml-2 text-lg">
                (L5 Senior Engineer)
              </span>
            </h2>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-3 text-purple-800">
                  Key Requirements
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>8+ years of distributed systems experience</li>
                  <li>Mentorship and technical leadership</li>
                  <li>Cross-functional project ownership</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-3 text-purple-800">
                  Expected Impact
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Architectural decision making</li>
                  <li>Mentoring junior engineers</li>
                  <li>Driving technical initiatives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Gap Analysis Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Skill Gap Analysis
          </h2>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            {["technical", "experience", "leadership"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-xl text-center capitalize ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category} Skills
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {gapAnalysis
              .filter((item) => item.category === selectedCategory)
              .map((gap) => (
                <div
                  key={gap.skill}
                  className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-red-800">
                        {gap.skill}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {gap.gapLevel} gap
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setExpandedGap(
                          expandedGap === gap.skill ? null : gap.skill
                        )
                      }
                      className="p-2 hover:bg-red-100 rounded-full"
                    >
                      <FiChevronDown
                        className={`transform transition-transform ${
                          expandedGap === gap.skill ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {expandedGap === gap.skill && (
                    <div className="mt-4 space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium mb-2 text-gray-800">
                          Recommended Actions
                        </h4>
                        <ul className="list-disc pl-6 space-y-2">
                          {gap.recommendedActions.map((action, i) => (
                            <li key={i} className="text-gray-700">
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium mb-2 text-gray-800">
                          Learning Resources
                        </h4>
                        <div className="grid gap-3">
                          {gap.resources.map((resource, i) => (
                            <a
                              key={i}
                              href={resource.url}
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="text-gray-700">
                                {resource.title}
                              </span>
                              <FiExternalLink className="text-gray-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Experience Roadmap */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Experience Roadmap
          </h2>
          <div className="space-y-8">
            {learningRoadmap.map((phase) => (
              <div
                key={phase.phase}
                className="border-l-4 border-blue-500 pl-6 relative"
              >
                <div className="absolute w-8 h-8 bg-blue-500 rounded-full -left-4 top-0 flex items-center justify-center text-white">
                  {phase.phase}
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {phase.title}
                  <span className="ml-2 text-gray-500 text-sm font-normal">
                    {phase.timeline}
                  </span>
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-medium mb-2 text-blue-800">
                      Skills to Acquire
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {phase.skillsToAcquire.map((skill, i) => (
                        <li key={i} className="text-gray-700">
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h4 className="font-medium mb-2 text-purple-800">
                      Recommended Projects
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {phase.projects.map((project, i) => (
                        <li key={i} className="text-gray-700">
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-medium mb-2 text-green-800">
                      Key Milestones
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {phase.milestones.map((milestone, i) => (
                        <li key={i} className="text-gray-700">
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Requirements */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Experience Requirements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {experienceRequirements.map((exp, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${
                      exp.type === "professional"
                        ? "bg-blue-100"
                        : exp.type === "project"
                        ? "bg-purple-100"
                        : "bg-green-100"
                    }`}
                  >
                    {exp.type === "professional" && (
                      <FiBriefcase className="w-6 h-6 text-blue-600" />
                    )}
                    {exp.type === "project" && (
                      <FiCode className="w-6 h-6 text-purple-600" />
                    )}
                    {exp.type === "open-source" && (
                      <FiGithub className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold capitalize">
                    {exp.type} Experience
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">{exp.description}</p>
                {exp.duration && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <FiClock />
                    <span>Recommended Duration: {exp.duration}</span>
                  </div>
                )}
                {exp.exampleProjects && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-2 text-gray-800">
                      Example Projects
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      {exp.exampleProjects.map((project, i) => (
                        <li key={i} className="text-gray-700">
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
