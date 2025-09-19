"use client";

import React from "react";
import { JobTrackerUI, LoadingState, ErrorState } from "./JobTrackerComponents";
import { useJobTracker } from "./JobTrackerLogic";

export default function JobTrackerPage() {
  const {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    moveApplication,
  } = useJobTracker();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <JobTrackerUI
      applications={applications}
      onCreateApplication={createApplication}
      onUpdateApplication={updateApplication}
      onDeleteApplication={deleteApplication}
      onMoveApplication={moveApplication}
    />
  );
}
