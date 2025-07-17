"use client";

import React from "react";
import {
  ResumeOptimizerUI,
  LoadingState,
  UnauthenticatedState,
} from "./ResumeOptimizerComponents";
import { useResumeOptimizer } from "./ResumeOptimizerLogic";

export default function ResumeOptimizer() {
  const {
    resumeText,
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
    handleFileUpload,
    clearResumeFile,
    isProcessingFile,
  } = useResumeOptimizer();

  // Render loading state
  if (status === "loading" || loading) {
    return <LoadingState />;
  }

  // Render if user is not logged in
  if (!session) {
    return <UnauthenticatedState />;
  }

  // Render the main resume optimizer content
  return (
    <ResumeOptimizerUI
      isOpen={isOpen}
      resumeText={resumeText}
      jobDescription={jobDescription}
      setJobDescription={setJobDescription}
      response={response}
      loading={loading}
      error={error}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleSubmit={handleSubmit}
      handleDownload={handleDownload}
      resumeFile={resumeFile}
      handleFileUpload={handleFileUpload}
      clearResumeFile={clearResumeFile}
      isProcessingFile={isProcessingFile}
    />
  );
}
