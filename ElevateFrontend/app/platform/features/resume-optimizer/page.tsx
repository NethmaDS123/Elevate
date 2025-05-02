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
  FiBookOpen,
  FiThumbsUp,
  FiAlertTriangle,
  FiZap,
} from "react-icons/fi";

interface OptimizationResponse {
  optimized_resume: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  ats_score: number;
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
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
                Analysis
              </button>
              <button
                onClick={() => setActiveTab("recommendations")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "recommendations"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <FiZap className="w-5 h-5" />
                Recommendations
              </button>
            </div>

            {activeTab === "overview" && (
              <div className="grid gap-6">
                <AnalysisSection title="ATS Score" icon={<FiActivity />}>
                  <div className="text-3xl font-bold text-blue-600">
                    {response.ats_score}%
                  </div>
                  <ProgressBar value={response.ats_score} />
                  <div className="mt-4 text-sm text-gray-600">
                    This score reflects how well your resume matches the job
                    requirements based on ATS algorithms and keyword
                    optimization.
                  </div>
                </AnalysisSection>
              </div>
            )}

            {activeTab === "analysis" && (
              <div className="grid gap-6 md:grid-cols-2">
                <AnalysisSection title="Strengths" icon={<FiThumbsUp />}>
                  <ul className="space-y-3">
                    {response.analysis.strengths.map((strength, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1 text-green-600">
                          <FiThumbsUp className="w-4 h-4" />
                        </div>
                        <div className="text-sm text-green-800">{strength}</div>
                      </li>
                    ))}
                  </ul>
                </AnalysisSection>

                <AnalysisSection title="Weaknesses" icon={<FiAlertTriangle />}>
                  <ul className="space-y-3">
                    {response.analysis.weaknesses.map((weakness, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1 text-red-600">
                          <FiAlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="text-sm text-red-800">{weakness}</div>
                      </li>
                    ))}
                  </ul>
                </AnalysisSection>
              </div>
            )}

            {activeTab === "recommendations" && (
              <div className="grid gap-6">
                <AnalysisSection
                  title="Improvement Recommendations"
                  icon={<FiZap />}
                >
                  <ul className="space-y-4">
                    {response.analysis.recommendations.map(
                      (recommendation, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg"
                        >
                          <div className="flex-shrink-0 mt-1 text-blue-600">
                            <FiZap className="w-5 h-5" />
                          </div>
                          <div className="text-sm text-gray-800">
                            {recommendation}
                          </div>
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
