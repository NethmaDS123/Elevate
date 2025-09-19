"use client";

import React from "react";
import {
  SkillGapAnalysisUI,
  LoadingState,
  UnauthenticatedState,
} from "./SkillGapAnalysisComponents";
import { useSkillGapAnalysis } from "./SkillGapAnalysisLogic";

export default function SkillGapAnalysisPage() {
  const {
    roleLevel,
    setRoleLevel,
    domain,
    setDomain,
    resumeText,
    setResumeText,
    analysis,
    loading,
    error,
    activeTab,
    setActiveTab,
    session,
    status,
    isOpen,
    handleSubmit,
  } = useSkillGapAnalysis();

  // Render loading state
  if (status === "loading") {
    return <LoadingState />;
  }

  // Render if user is not logged in
  if (!session) {
    return <UnauthenticatedState />;
  }

  // Render the main skill gap analysis content
  return (
    <SkillGapAnalysisUI
      isOpen={isOpen}
      roleLevel={roleLevel}
      setRoleLevel={setRoleLevel}
      domain={domain}
      setDomain={setDomain}
      resumeText={resumeText}
      setResumeText={setResumeText}
      analysis={analysis}
      loading={loading}
      error={error}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleSubmit={handleSubmit}
    />
  );
}
