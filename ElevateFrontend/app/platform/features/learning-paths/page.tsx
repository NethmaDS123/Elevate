"use client";

import React, { useState } from "react";
import { BookOpenIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

interface TopicBreakdown {
  title: string;
  subtopics: string[];
}

interface ModuleData {
  moduleTitle: string;
  topics: TopicBreakdown[];
}

interface ParsedPathway {
  topic: string;
  modules: ModuleData[];
}

function parseLearningPathway(text: string): ParsedPathway | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const firstLineMatch = lines[0].match(/^Learning Pathway for (.+):$/i);
  if (!firstLineMatch) return null;
  const topic = firstLineMatch[1];

  const modules: ModuleData[] = [];
  let currentModule: ModuleData | null = null;
  let currentTopic: TopicBreakdown | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    const moduleMatch = line.match(/^Module\s+\d+:\s*(.+)$/i);
    if (moduleMatch) {
      if (currentModule) modules.push(currentModule);
      currentModule = { moduleTitle: moduleMatch[1], topics: [] };
      currentTopic = null;
      continue;
    }

    const topicMatch = line.match(/^- (.+)$/);
    if (topicMatch && currentModule) {
      currentTopic = { title: topicMatch[1], subtopics: [] };
      currentModule.topics.push(currentTopic);
      continue;
    }

    const subtopicMatch = line.match(/^\* (.+)$/);
    if (subtopicMatch && currentTopic) {
      currentTopic.subtopics.push(subtopicMatch[1]);
    }
  }

  if (currentModule) modules.push(currentModule);
  return modules.length > 0 ? { topic, modules } : null;
}

export default function LearningPathwaysPage() {
  const [searchTopic, setSearchTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pathway, setPathway] = useState<ParsedPathway | null>(null);

  const exampleTopics = [
    "Blockchain",
    "AI Ethics",
    "Cloud Computing",
    "Data Structures",
    "Algorithms",
    "Operating Systems",
    "Computer Networks",
    "Databases",
    "Software Engineering",
    "Distributed Systems",
    "Cybersecurity",
    "Machine Learning",
    "DevOps",
    "Computer Architecture",
    "Web Development",
  ];

  const fetchLearningPathway = async (topic: string) => {
    setError("");
    setPathway(null);
    if (!topic.trim()) {
      setError("Please enter a topic to search.");
      return;
    }

    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";
      const res = await fetch(`${backendUrl}/learning_pathways`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to fetch learning pathway");
        return;
      }

      const parsed = parseLearningPathway(data.learning_pathway);
      if (!parsed) {
        setError("Invalid pathway format received");
        return;
      }

      setPathway(parsed);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the learning pathway");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchLearningPathway(searchTopic);
  };

  const handleExampleClick = async (topic: string) => {
    setSearchTopic(topic);
    await fetchLearningPathway(topic);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">
            Learning Pathways
          </h1>
          <p className="text-gray-600 text-lg">
            Master complex technical subjects through structured learning paths
          </p>
        </header>

        {/* Search Section */}
        <div className="mb-16">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Enter a technical topic (e.g., Machine Learning, Cybersecurity)"
                className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-400 text-lg shadow-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium shadow-lg hover:shadow-xl"
              >
                {loading ? "Generating..." : "Generate Pathway"}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-red-600" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
          </form>

          <div className="mt-12">
            <h3 className="text-lg font-medium text-black mb-6 flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6 text-purple-600" />
              Popular Technical Topics:
            </h3>
            <div className="flex flex-wrap gap-3">
              {exampleTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleExampleClick(topic)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-purple-50 transition-all text-black text-sm font-medium hover:border-purple-200 hover:shadow-md"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pathway Display */}
        {pathway && (
          <div className="space-y-12">
            <header className="text-center mb-16">
              <h2 className="text-3xl font-bold text-black mb-4">
                Learning Pathway: {pathway.topic}
              </h2>
              <div className="flex justify-center gap-4">
                <div className="badge badge-lg badge-primary gap-2 px-4 py-3 bg-purple-100 text-purple-700">
                  <AcademicCapIcon className="h-5 w-5" />
                  {pathway.modules.length} Core Modules
                </div>
                <div className="badge badge-lg badge-secondary gap-2 px-4 py-3 bg-blue-100 text-blue-700">
                  <BookOpenIcon className="h-5 w-5" />
                  {pathway.modules.reduce(
                    (acc, m) => acc + m.topics.length,
                    0
                  )}{" "}
                  Key Topics
                </div>
              </div>
            </header>

            <div className="space-y-8">
              {pathway.modules.map((module, moduleIdx) => (
                <div
                  key={moduleIdx}
                  className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-xl font-bold">
                        {moduleIdx + 1}
                      </div>
                      <h2 className="text-2xl font-bold text-black">
                        {module.moduleTitle}
                      </h2>
                    </div>

                    <div className="space-y-6">
                      {module.topics.map((topic, topicIdx) => (
                        <div
                          key={topicIdx}
                          className="pl-6 border-l-4 border-purple-100"
                        >
                          <h3 className="text-lg font-semibold text-black mb-3">
                            {topic.title}
                          </h3>
                          {topic.subtopics.length > 0 && (
                            <ul className="space-y-2.5">
                              {topic.subtopics.map((subtopic, subtopicIdx) => (
                                <li
                                  key={subtopicIdx}
                                  className="flex items-start gap-2 text-gray-800"
                                >
                                  <svg
                                    className="w-4 h-4 mt-1.5 text-purple-600 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span>{subtopic}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
