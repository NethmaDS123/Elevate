"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/components/SidebarContext";

// Define interface for OptimizationResponse
export interface OptimizationResponse {
  optimized_resume: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  format_analysis?: {
    page_count_assessment: string;
    font_assessment: string;
    color_assessment: string;
    spacing_assessment: string;
    overall_design_assessment: string;
    format_recommendations: string[];
  };
  ats_score: number;
  ats_score_breakdown?: {
    keyword_matching: number;
    content_quality: number;
    format_readability: number;
    quantified_achievements: number;
  };
  human_readability?: {
    score: number;
    visual_appeal: string;
    storytelling: string;
    impact_assessment: string;
    improvement_suggestions: string[];
  };
}

export function useResumeOptimizer() {
  const { data: session, status } = useSession();
  const { isOpen } = useSidebar();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState<OptimizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [formatDetails, setFormatDetails] = useState<any>(null);

  // Function to handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    setResumeFile(file);
    setIsProcessingFile(true);
    setError("");

    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append("resume", file);

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

      // Send the file to extract text
      const res = await axios.post(
        `${backendUrl}/extract_resume_text`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.user.id_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the resume text with the extracted content
      setResumeText(res.data.text);

      // Store the formatting details for later use
      setFormatDetails(res.data.format_details);
    } catch (err) {
      console.error("Error processing resume file:", err);
      setError("Failed to process resume file. Please try again.");
      setResumeFile(null);
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Function to clear the resume file
  const clearResumeFile = () => {
    setResumeFile(null);
    setResumeText("");
    setFormatDetails(null);
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError("You must be logged in to optimize your resume.");
      return;
    }

    if (!resumeText) {
      setError("Please upload a resume file first.");
      return;
    }

    if (!jobDescription) {
      setError("Please enter a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

      const res = await axios.post<OptimizationResponse>(
        `${backendUrl}/optimize_resume`,
        {
          resume_text: resumeText,
          job_description: jobDescription,
          format_details: formatDetails, // Include formatting details
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

  // Function to handle download of optimized resume
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

  return {
    resumeText,
    setResumeText,
    jobDescription,
    setJobDescription,
    response,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleSubmit,
    handleDownload,
    session,
    status,
    isOpen,
    resumeFile,
    setResumeFile,
    handleFileUpload,
    clearResumeFile,
    isProcessingFile,
    formatDetails,
  };
}
