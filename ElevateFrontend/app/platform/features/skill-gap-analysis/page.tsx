"use client";

// Import necessary dependencies
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { FiLoader, FiStar, FiTrendingUp } from "react-icons/fi";

// Define interfaces for type safety
interface AnalysisData {
  metadata: {
    parse_quality: {
      skills_extracted: number;
      projects_analyzed: number;
      leadership_roles: number;
      parse_attempts: number;
    };
    benchmark_sources: string[];
  };
  detailed_gap_analysis: {
    strengths: {
      skill: string;
      reasoning: string;
    }[];
    areas_for_improvement: {
      category: string;
      current_situation: string;
      ideal_situation: string;
      urgency: string;
      reasoning: string;
    }[];
  };
  strategic_roadmap: {
    short_term_goals: RoadmapItem[];
    medium_term_goals: RoadmapItem[];
    long_term_goals: RoadmapItem[];
  };
  resume_improvements: {
    section: string;
    original: string;
    improved: string;
  }[];
}

// Define interface for roadmap items
interface RoadmapItem {
  timeframe: string;
  goal: string;
  actions: string[];
  reasoning: string;
}

// Main component for skill benchmarking analysis
export default function SkillBenchmarking() {
  // State management using hooks
  const { data: session, status } = useSession();
  const [roleLevel, setRoleLevel] = useState("internship");
  const [domain, setDomain] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission and API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnalysis(null);

    const backend =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://elevatebackend.onrender.com";

    try {
      // Make API request to backend
      const response = await fetch(`${backend}/skill_benchmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.id_token}`,
        },
        body: JSON.stringify({
          resume_text: resumeText,
          target_role_level: roleLevel,
          domain,
        }),
      });

      if (!response.ok)
        throw new Error(`Analysis failed: ${response.statusText}`);

      const data: AnalysisData = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // Loading and authentication states
  if (status === "loading")
    return (
      <div className="flex justify-center py-20">
        <FiLoader className="animate-spin text-blue-600" size={24} />
      </div>
    );
  if (!session)
    return <div className="py-20 text-center">Please log in to continue.</div>;

  // Main render
  return (
    <div className="container mx-auto p-6 space-y-8 max-w-5xl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
        <FiTrendingUp className="text-blue-600" /> Skill Benchmark Analysis
      </h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-md"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {/* Role Level Selection */}
          <select
            className="p-3 rounded border"
            value={roleLevel}
            onChange={(e) => setRoleLevel(e.target.value)}
            disabled={loading}
          >
            <option value="internship">Internship</option>
            <option value="junior">Junior Engineer</option>
            <option value="mid">Mid-level Engineer</option>
            <option value="senior">Senior Engineer</option>
            <option value="staff">Staff Engineer</option>
          </select>
          {/* Domain Input */}
          <input
            type="text"
            placeholder="Domain (e.g., Software Engineering)"
            className="p-3 rounded border"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        {/* Resume Text Input */}
        <textarea
          placeholder="Paste your resume content"
          className="w-full p-3 rounded border"
          rows={6}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          disabled={loading}
          required
        />
        {/* Submit Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded flex items-center justify-center gap-2 w-full"
          disabled={loading}
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiStar />}{" "}
          {loading ? "Analyzing..." : "Run Elite Analysis"}
        </button>
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded">{error}</div>
        )}
      </form>

      {/* Analysis Results Display */}
      {analysis && (
        <>
          {/* Gap Analysis Section */}
          <section>
            <h2 className="font-bold text-2xl">
              🚩 Detailed Gap Analysis & Comparison
            </h2>
            {/* Strengths Display */}
            <h3 className="mt-4 font-semibold text-lg">
              ✅ Strengths You Already Possess:
            </h3>
            {analysis.detailed_gap_analysis.strengths.map((s, idx) => (
              <div key={idx} className="bg-green-50 p-4 rounded shadow mb-3">
                <strong>{s.skill}</strong>
                <p>{s.reasoning}</p>
              </div>
            ))}

            {/* Areas for Improvement Display */}
            <h3 className="mt-4 font-semibold text-lg">
              ❗ Areas for Improvement:
            </h3>
            {analysis.detailed_gap_analysis.areas_for_improvement.map(
              (gap, idx) => (
                <div key={idx} className="bg-red-50 p-4 rounded shadow mb-3">
                  <strong>{gap.category}</strong> (Urgency: {gap.urgency})
                  <p>
                    <strong>Current:</strong> {gap.current_situation}
                  </p>
                  <p>
                    <strong>Ideal:</strong> {gap.ideal_situation}
                  </p>
                  <p>{gap.reasoning}</p>
                </div>
              )
            )}
          </section>

          {/* Strategic Roadmap Section */}
          <section className="mt-8">
            <h2 className="font-bold text-2xl">🚀 Strategic Career Roadmap</h2>
            {["short_term_goals", "medium_term_goals", "long_term_goals"].map(
              (phase) => {
                // Safely get the array, defaulting to empty if undefined
                const items =
                  analysis.strategic_roadmap[
                    phase as keyof typeof analysis.strategic_roadmap
                  ] ?? [];

                return (
                  <div key={phase} className="mt-4">
                    <h3 className="font-semibold capitalize">
                      {phase.replace(/_/g, " ")}
                    </h3>
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-50 p-4 rounded shadow mb-3"
                      >
                        <strong>{item.goal}</strong> ({item.timeframe})
                        <ul className="list-disc ml-4">
                          {item.actions.map((act, aIdx) => (
                            <li key={aIdx}>{act}</li>
                          ))}
                        </ul>
                        <p>{item.reasoning}</p>
                      </div>
                    ))}
                  </div>
                );
              }
            )}
          </section>

          {/* Resume Improvements Section */}
          <section className="mt-8">
            <h2 className="font-bold text-2xl">
              🎯 Resume Improvement Examples
            </h2>
            {analysis.resume_improvements.map((imp, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded shadow mb-3">
                <strong>{imp.section}</strong>
                <p>
                  <em>Original:</em> {imp.original}
                </p>
                <p>
                  <em>Improved:</em> {imp.improved}
                </p>
              </div>
            ))}
          </section>

          {/* Benchmark Sources Section */}
          <section className="mt-8 text-sm text-gray-600">
            <strong>Benchmark Sources:</strong>{" "}
            {analysis.metadata.benchmark_sources.join(", ")}
          </section>
        </>
      )}
    </div>
  );
}
