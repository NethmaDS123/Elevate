"use client";

import React from "react";
import {
  CoverLetterGeneratorUI,
  LoadingState,
  UnauthenticatedState,
} from "./CoverLetterComponents";
import { useCoverLetterGenerator } from "./CoverLetterLogic";

export default function CoverLetterGenerator() {
  const {
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
    handleFileUpload,
    clearResumeFile,
    isProcessingFile,
    handleCoverLetterEdit,
    handleSaveCoverLetter,
    isSaving,
    saveSuccess,
  } = useCoverLetterGenerator();

  // Render loading state
  if (status === "loading" || loading) {
    return <LoadingState />;
  }

  // Render if user is not logged in
  if (!session) {
    return <UnauthenticatedState />;
  }

  // Render the main cover letter generator content
  return (
    <CoverLetterGeneratorUI
      isOpen={isOpen}
      resumeText={resumeText}
      setResumeText={setResumeText}
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
      handleCoverLetterEdit={handleCoverLetterEdit}
      handleSaveCoverLetter={handleSaveCoverLetter}
      isSaving={isSaving}
      saveSuccess={saveSuccess}
    />
  );
}
