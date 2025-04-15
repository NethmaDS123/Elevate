"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FiLoader, FiArrowRight } from "react-icons/fi";

interface OptimizationResponse {
  optimized_resume: string;
}

export default function ResumeOptimizer() {
  const { data: session, status } = useSession();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Latest Optimized Resume
              </h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="prose prose-blue max-w-none overflow-auto h-[600px]">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                  {response.optimized_resume}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
