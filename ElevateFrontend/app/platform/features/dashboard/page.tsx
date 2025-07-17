"use client";

import React from "react";
import {
  DashboardUI,
  LoadingState,
  ErrorState,
  UnauthenticatedState,
  NoDataState,
} from "./DashboardComponents";
import { useDashboardData } from "./DashboardLogic";

export default function DashboardPage() {
  const {
    dashboardData,
    loading,
    error,
    isOpen,
    session,
    status,
    staticQuickActions,
  } = useDashboardData();

  // Render loading state
  if (status === "loading" || loading) {
    return <LoadingState />;
  }

  // Render if user is not logged in
  if (!session) {
    return <UnauthenticatedState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  // Render if no dashboard data is available
  if (!dashboardData) {
    return <NoDataState />;
  }

  // Render the main dashboard content
  return (
    <DashboardUI
      isOpen={isOpen}
      dashboardData={dashboardData}
      staticQuickActions={staticQuickActions}
    />
  );
}
