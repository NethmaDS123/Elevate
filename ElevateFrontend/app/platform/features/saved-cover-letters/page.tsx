"use client";

import React from "react";
import {
  SavedCoverLettersUI,
  LoadingState,
  UnauthenticatedState,
} from "./SavedCoverLettersComponents";
import { useSavedCoverLetters } from "./SavedCoverLettersLogic";

export default function SavedCoverLettersPage() {
  const {
    coverLetters,
    loading,
    error,
    deleting,
    deleteCoverLetter,
    downloadCoverLetter,
    session,
    status,
    isOpen,
  } = useSavedCoverLetters();

  // Render loading state
  if (status === "loading") {
    return <LoadingState />;
  }

  // Render if user is not logged in
  if (!session) {
    return <UnauthenticatedState />;
  }

  // Render the main saved cover letters content
  return (
    <SavedCoverLettersUI
      isOpen={isOpen}
      coverLetters={coverLetters}
      loading={loading}
      error={error}
      deleting={deleting}
      onDelete={deleteCoverLetter}
      onDownload={downloadCoverLetter}
    />
  );
}
