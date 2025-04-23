"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  FiLoader,
  FiArrowRight,
  FiDownload,
  FiActivity,
  FiTarget,
  FiTool,
  FiBookOpen,
} from "react-icons/fi";

interface OptimizationResponse {
  initial_assessment: {
    score: number;
    strengths: string[];
    content_gaps: string[];
  };
  relevance_analysis: {
    score: number;
    work_matches: string[];
    project_matches: string[];
    skill_gaps: string[];
  };
  optimized_resume: string;
  final_evaluation: {
    score: number;
    integrity_check: {
      new_content_added: boolean;
      original_data_retained: number;
    };
  };
  career_development: {
    skills_to_learn: string[];
    project_ideas: string[];
    certifications: string[];
  };
}

export default function ResumeOptimizer() {
  const { data: session, status } = useSession();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError("You must be logged in to optimize your resume.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";

      const res = await axios.post<OptimizationResponse>(
        `${backendUrl}/optimize_resume`,
        {
          resume_text: resumeText,
          job_description: jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.id_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data);
    } catch (err) {
      console.error("Error optimizing resume:", err);
      setError("Failed to optimize resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Please log in to access the Resume Optimizer.
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    if (!response?.optimized_resume) return;

    const blob = new Blob([response.optimized_resume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optimized-resume-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ScoreChange = ({
    initial,
    final,
  }: {
    initial: number;
    final: number;
  }) => (
    <div className="flex items-center gap-4">
      <div className="text-2xl font-bold text-blue-600">
        {initial} → {final}
      </div>
      <div
        className={`px-3 py-1 rounded-full ${
          final > initial
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {(((final - initial) / initial) * 100).toFixed(1)}%
      </div>
    </div>
  );

  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const AnalysisSection = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI Resume Optimizer
          </h1>
          <p className="text-gray-600 text-lg">
            Enhance your resume for ATS systems and job-specific requirements.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">
                  Your Resume
                </span>
                <textarea
                  placeholder="Paste your current resume..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-64 text-gray-900"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </label>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium mb-2 block">
                  Job Description
                </span>
                <textarea
                  placeholder="Paste the target job description..."
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-64 text-gray-900"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin h-5 w-5" />
                Optimizing...
              </>
            ) : (
              <>
                <FiArrowRight className="h-5 w-5" />
                Optimize Resume
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </form>

        {response && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200 pb-4">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "overview"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <FiActivity className="w-5 h-5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("resume")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "resume"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <FiBookOpen className="w-5 h-5" />
                Optimized Resume
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "analysis"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <FiTarget className="w-5 h-5" />
                Job Analysis
              </button>
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "suggestions"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <FiTool className="w-5 h-5" />
                Suggestions
              </button>
            </div>

            {activeTab === "overview" && (
              <div className="grid gap-6 md:grid-cols-2">
                <AnalysisSection
                  title="Score Improvement"
                  icon={<FiActivity />}
                >
                  <ScoreChange
                    initial={response.initial_assessment.score}
                    final={response.final_evaluation.score}
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Content Integrity
                    </p>
                    <ProgressBar
                      value={
                        response.final_evaluation.integrity_check
                          .original_data_retained
                      }
                    />
                    <span className="text-sm text-gray-500">
                      {
                        response.final_evaluation.integrity_check
                          .original_data_retained
                      }
                      % original content retained
                    </span>
                  </div>
                </AnalysisSection>

                <AnalysisSection title="Relevance Score" icon={<FiTarget />}>
                  <div className="text-3xl font-bold text-blue-600">
                    {response.relevance_analysis.score}%
                  </div>
                  <ProgressBar value={response.relevance_analysis.score} />
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Top Matches
                    </p>
                    <ul className="space-y-2">
                      {response.relevance_analysis.work_matches
                        .slice(0, 3)
                        .map((match, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-center gap-2"
                          >
                            <span className="text-green-600">✓</span>
                            {match}
                          </li>
                        ))}
                    </ul>
                  </div>
                </AnalysisSection>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="grid gap-6 md:grid-cols-2">
                <AnalysisSection title="Experience Matches" icon={<FiTool />}>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Work Experience</h4>
                      <ul className="space-y-3">
                        {response.relevance_analysis.work_matches.map(
                          (match, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>{match.split(" (")[0]}</span>
                              <span className="text-blue-600">
                                {match.split(" (")[1]}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Project Matches</h4>
                      <ul className="space-y-3">
                        {response.relevance_analysis.project_matches.map(
                          (match, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>{match.split(" (")[0]}</span>
                              <span className="text-blue-600">
                                {match.split(" (")[1]}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </AnalysisSection>

                <AnalysisSection title="Skill Gaps" icon={<FiTool />}>
                  <ul className="space-y-3">
                    {response.relevance_analysis.skill_gaps.map((gap, i) => (
                      <li key={i} className="text-sm p-3 bg-red-50 rounded-lg">
                        <div className="font-medium text-red-700">
                          {gap.split(": ")[0]}
                        </div>
                        <div className="text-red-600">{gap.split(": ")[1]}</div>
                      </li>
                    ))}
                  </ul>
                </AnalysisSection>
              </div>
            )}

            {activeTab === "suggestions" && (
              <div className="grid gap-6 md:grid-cols-2">
                <AnalysisSection title="Skill Development" icon={<FiTool />}>
                  <ul className="space-y-3">
                    {response.career_development.skills_to_learn.map(
                      (skill, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="h-2 w-2 bg-blue-600 rounded-full" />
                          {skill}
                        </li>
                      )
                    )}
                  </ul>
                </AnalysisSection>

                <AnalysisSection title="Project Ideas" icon={<FiTool />}>
                  <ul className="space-y-3">
                    {response.career_development.project_ideas.map(
                      (idea, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm p-3 bg-green-50 rounded-lg"
                        >
                          <div className="h-2 w-2 bg-green-600 rounded-full" />
                          {idea}
                        </li>
                      )
                    )}
                  </ul>
                </AnalysisSection>

                <AnalysisSection title="Certifications" icon={<FiTool />}>
                  <ul className="space-y-3">
                    {response.career_development.certifications.map(
                      (cert, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm p-3 bg-purple-50 rounded-lg"
                        >
                          <div className="h-2 w-2 bg-purple-600 rounded-full" />
                          {cert}
                        </li>
                      )
                    )}
                  </ul>
                </AnalysisSection>
              </div>
            )}

            {activeTab === "resume" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Optimized Resume</h3>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <FiDownload className="w-5 h-5" />
                    Download
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                    {response.optimized_resume}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
