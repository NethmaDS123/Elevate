"use client";

import React, { useState } from "react";
import { BookOpenIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
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

    if (!session?.user?.id_token) {
      setError("You must be logged in to generate a pathway.");
      return;
    }

    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const res = await fetch(`${backendUrl}/learning_pathways`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.id_token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to fetch learning pathway");
        return;
      }

      if (data.status === "completed") {
        const parsed = parseLearningPathway(data.learning_pathway);
        if (!parsed) {
          setError("Invalid pathway format received");
          return;
        }
        setPathway(parsed);
      } else {
        setError(data.error || "Pathway generation failed");
      }
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AcademicCapIcon className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Please log in to access Learning Pathways.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Learning Pathways
          </h1>
          <p className="text-xl text-gray-600">
            Master complex technical subjects through structured learning paths
          </p>
        </header>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Enter a technical topic (e.g., Machine Learning)"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 placeholder-gray-400 text-lg"
              />
              <BookOpenIcon className="h-6 w-6 text-gray-400 absolute right-6 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-shadow duration-200 md:w-48"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 animate-spin" />
                  Generating...
                </span>
              ) : (
                "Generate Pathway"
              )}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3 border border-red-200">
              <AcademicCapIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}
        </form>

        <div className="mt-12 flex flex-wrap gap-3">
          {exampleTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleExampleClick(topic)}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors duration-150 font-medium shadow-sm"
            >
              {topic}
            </button>
          ))}
        </div>

        {pathway && (
          <div className="mt-16 space-y-12">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {pathway.topic}
                </span>{" "}
                Learning Pathway
              </h2>

              {pathway.modules.map((module, idx) => (
                <div key={idx} className="group relative mb-12">
                  <div className="absolute -left-8 top-6 h-full w-1 bg-gray-100 group-first:h-[calc(100%-2.5rem)] group-last:h-[2.5rem]" />
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-bold text-xl">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {module.moduleTitle}
                      </h3>
                      <div className="space-y-6">
                        {module.topics.map((topic, topicIdx) => (
                          <div
                            key={topicIdx}
                            className="bg-gray-50 rounded-xl p-6"
                          >
                            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full" />
                              {topic.title}
                            </h4>
                            <ul className="space-y-2 ml-6">
                              {topic.subtopics.map((sub, subIdx) => (
                                <li
                                  key={subIdx}
                                  className="text-gray-600 before:content-['▹'] before:text-purple-500 before:mr-2"
                                >
                                  {sub}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
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
