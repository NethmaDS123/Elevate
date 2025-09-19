"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/components/SidebarContext";

// Define interface for Enhanced CoverLetterResponse (narrative-driven)
export interface CoverLetterResponse {
  cover_letter: string;
  narrative_strengths: string[];
  research_depth: string;
  improvement_suggestions: string[];
  story_flow_score: number;
  alignment_explanation: string;
  generated_at: string;
}

export function useCoverLetterGenerator() {
  const { data: session, status } = useSession();
  const { isOpen } = useSidebar();
  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [response, setResponse] = useState<CoverLetterResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("cover-letter");

  // File upload states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  // Save states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setResumeFile(file);
    setIsProcessingFile(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        "https://elevatebackend.onrender.com/extract_resume_text",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session?.user.id_token}`,
          },
        }
      );

      if (response.data.text) {
        setResumeText(response.data.text);
      } else {
        throw new Error("Failed to extract text from resume");
      }
    } catch (err: any) {
      console.error("File upload error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to process resume file"
      );
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Clear resume file
  const clearResumeFile = () => {
    setResumeFile(null);
    setResumeText("");
  };

  // Handle cover letter generation
  const handleSubmit = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please provide both resume content and job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    setSaveSuccess(null);

    try {
      const response = await axios.post(
        "https://elevatebackend.onrender.com/generate_cover_letter",
        {
          resume_text: resumeText,
          job_description: jobDescription,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.id_token}`,
          },
        }
      );

      if (response.data.success) {
        setResponse({
          cover_letter: response.data.cover_letter,
          narrative_strengths: response.data.narrative_strengths,
          research_depth: response.data.research_depth,
          improvement_suggestions: response.data.improvement_suggestions,
          story_flow_score: response.data.story_flow_score,
          alignment_explanation: response.data.alignment_explanation,
          generated_at: response.data.generated_at,
        });
        setActiveTab("cover-letter");
      } else {
        throw new Error(
          response.data.message || "Failed to generate cover letter"
        );
      }
    } catch (err: any) {
      console.error("Cover letter generation error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to generate cover letter. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cover letter download
  const handleDownload = () => {
    if (!response?.cover_letter) return;

    // Format the cover letter for download
    const formattedContent = response.cover_letter
      .replace(/\\n\\n/g, "\n\n") // Replace \\n\\n with actual double line breaks
      .replace(/\\n/g, "\n") // Replace \\n with actual line breaks
      .replace(/\n{3,}/g, "\n\n") // Replace multiple line breaks with double line breaks
      .trim(); // Remove leading/trailing whitespace

    const element = document.createElement("a");
    const file = new Blob([formattedContent], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "cover_letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle manual editing of cover letter
  const handleCoverLetterEdit = (newContent: string) => {
    if (response) {
      setResponse({
        ...response,
        cover_letter: newContent,
      });
    }
  };

  // Handle saving cover letter
  const handleSaveCoverLetter = async (
    companyName: string,
    jobTitle: string
  ) => {
    if (!response?.cover_letter || !companyName.trim() || !jobTitle.trim()) {
      setError(
        "Please provide company name and job title to save the cover letter."
      );
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaveSuccess(null);

    try {
      const saveResponse = await axios.post(
        "https://elevatebackend.onrender.com/save_cover_letter",
        {
          cover_letter: response.cover_letter,
          company_name: companyName.trim(),
          job_title: jobTitle.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.id_token}`,
          },
        }
      );

      if (saveResponse.data.success) {
        setSaveSuccess(
          `Cover letter saved successfully for ${companyName} - ${jobTitle}`
        );
        // Clear success message after 3 seconds
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        throw new Error(
          saveResponse.data.message || "Failed to save cover letter"
        );
      }
    } catch (err: any) {
      console.error("Save cover letter error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to save cover letter. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // Data states
    resumeText,
    setResumeText,
    jobDescription,
    setJobDescription,
    response,
    loading,
    error,
    activeTab,
    setActiveTab,

    // File upload states
    resumeFile,
    isProcessingFile,

    // Save states
    isSaving,
    saveSuccess,

    // Actions
    handleSubmit,
    handleDownload,
    handleFileUpload,
    clearResumeFile,
    handleCoverLetterEdit,
    handleSaveCoverLetter,

    // Session data
    session,
    status,
    isOpen,
  };
}
