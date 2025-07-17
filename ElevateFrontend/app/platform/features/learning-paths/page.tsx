"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"; // Import useSession hook from next-auth/react for session management
import { AcademicCapIcon, BookOpenIcon } from "@heroicons/react/24/outline"; // Import icons for UI

// Define interfaces for Topic, Step, and Pathway
interface Topic {
  name: string;
  subtopics: string[];
  resources: string[];
  projects: string[];
}

interface Step {
  step: number;
  title: string;
  duration: string;
  core_goals: string[];
  topics: Topic[];
}

interface Pathway {
  topic: string;
  timeline: string;
  steps: Step[];
  industry_readiness: string[];
  continuous_learning: string[];
}

export default function LearningPathwaysPage() {
  const { data: session, status } = useSession(); // Use the useSession hook to get the session data and status
  const [searchTopic, setSearchTopic] = useState(""); // State for the search topic
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(""); // State for error messages
  const [pathway, setPathway] = useState<Pathway | null>(null); // State for the pathway data

  const exampleTopics = [
    "Computer Science",
    "Data Science",
    "Computer Architecture",
    "Web Development",
    "Data Structures",
    "Algorithms",
    "Operating Systems",
    "Databases",
    "Software Engineering",
    "Distributed Systems",
    "Cybersecurity",
    "Machine Learning",
    "DevOps",
    "Blockchain",
    "AI",
    "Cloud Computing",
  ];

  // Function to fetch the learning pathway based on the topic
  const fetchLearningPathway = async (topic: string) => {
    setError(""); // Clear any existing error messages
    setPathway(null); // Reset the pathway state
    const token =
      session?.user?.accessToken ??
      // NextAuth by default returns id_token in session.user.id_token
      session?.user?.id_token;

    if (!token) {
      setError("You must be logged in to generate a pathway.");
      return;
    }

    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";
      const res = await fetch(`${backendUrl}/learning_pathways`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to fetch learning pathway");
      } else if (data.status === "completed") {
        setPathway(data.learning_pathway as Pathway);
      } else {
        setError("Pathway generation in progress or failed");
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the search form submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTopic.trim()) {
      await fetchLearningPathway(searchTopic.trim());
    }
  };

  // Function to handle example topic clicks
  const handleExampleClick = async (topic: string) => {
    setSearchTopic(topic);
    await fetchLearningPathway(topic);
  };

  // Render loading state if session status is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AcademicCapIcon className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }
  // Render login prompt if session is not found
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Please log in to access Learning Pathways.
        </p>
      </div>
    );
  }

  // Main render function
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Expert Learning Pathways
          </h1>
          <p className="text-xl text-gray-600">
            Structured roadmaps for mastering complex technical domains
          </p>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <BookOpenIcon className="h-6 w-6 text-gray-400 absolute right-6 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Enter a technical topic (e.g., Computer Science)"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 placeholder-gray-400 text-lg"
              />
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

        {/* Examples */}
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

        {/* Render Pathway */}
        {pathway && (
          <div className="mt-16 space-y-12">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold mb-2 text-gray-900">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {pathway.topic}
                  </span>{" "}
                  Learning Pathway
                </h2>
                <p className="text-lg text-gray-600">{pathway.timeline}</p>
              </div>

              {/* Steps */}
              {pathway.steps.map((s) => (
                <section key={s.step} className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Step {s.step}: {s.title}{" "}
                    <span className="text-gray-500">({s.duration})</span>
                  </h3>

                  {/* Core Goals */}
                  <div className="mb-6 bg-purple-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-purple-700 mb-2">
                      Core Goals
                    </h4>
                    <ul className="list-disc pl-6 text-gray-700">
                      {s.core_goals.map((goal, i) => (
                        <li key={i}>{goal}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Topics */}
                  <div className="space-y-6">
                    {s.topics.map((t, ti) => (
                      <div
                        key={ti}
                        className="bg-gray-50 rounded-xl p-6 shadow-sm"
                      >
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full" />
                          {t.name}
                        </h4>

                        {/* Subtopics */}
                        {t.subtopics.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2">
                              Subtopics
                            </h5>
                            <ul className="list-disc pl-6 text-gray-600">
                              {t.subtopics.map((sub, si) => (
                                <li key={si}>{sub}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Resources */}
                        {t.resources.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-700 mb-2">
                              Recommended Resources
                            </h5>
                            <ul className="list-disc pl-6 text-blue-600">
                              {t.resources.map((res, ri) => (
                                <li key={ri}>{res}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Projects */}
                        {t.projects.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">
                              Project Ideas
                            </h5>
                            <ul className="list-disc pl-6 text-gray-600">
                              {t.projects.map((proj, pi) => (
                                <li key={pi}>{proj}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {/* Industry Readiness */}
              <div className="mt-12 bg-blue-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-blue-700 mb-4">
                  Industry Readiness
                </h3>
                <ul className="list-disc pl-6 text-gray-700">
                  {pathway.industry_readiness.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Continuous Learning */}
              <div className="mt-8 bg-green-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-green-700 mb-4">
                  Continuous Learning
                </h3>
                <ul className="list-disc pl-6 text-gray-700">
                  {pathway.continuous_learning.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
