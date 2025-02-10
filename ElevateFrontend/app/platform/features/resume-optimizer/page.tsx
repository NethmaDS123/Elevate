"use client";

import { useState } from "react";
import axios from "axios";
import { FiLoader, FiCheckCircle, FiArrowRight } from "react-icons/fi";

interface OptimizationResponse {
  optimized_resume: string;
  record_id?: string;
  user_id?: string;
}

export default function ResumeOptimizer() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post<OptimizationResponse>(
        "https://elevatebackend.onrender.com/optimize_resume",
        {
          resume_text: resumeText,
          job_description: jobDescription,
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            AI Resume Optimizer
          </h1>
          <p className="text-gray-600 text-lg">
            Enhance your resume for ATS systems and job-specific requirements
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
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-64"
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
                  className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-64"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
            <div className="grid gap-8 md:grid-cols-2">
              {/* Feedback Section */}
              <div className="border-r border-gray-100 pr-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FiCheckCircle className="text-green-600 h-6 w-6" />
                  Optimization Summary
                </h2>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Key Improvements
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-blue-700">
                      <li>ATS-friendly formatting applied</li>
                      <li>Job-specific keywords integrated</li>
                      <li>Improved readability and structure</li>
                      <li>Quantifiable achievements highlighted</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      Suggested Next Steps
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Review highlighted sections</li>
                      <li>Verify personal information</li>
                      <li>Double-check employment dates</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Optimized Resume Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Optimized Resume
                  </h2>
                  {response.record_id && (
                    <span className="text-sm text-gray-500">
                      ID: {response.record_id}
                    </span>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="prose prose-blue max-w-none overflow-auto h-[600px]">
                    <pre className="whitespace-pre-wrap font-sans text-gray-800">
                      {response.optimized_resume}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
