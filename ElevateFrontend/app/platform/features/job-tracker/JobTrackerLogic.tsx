"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  workType: "remote" | "hybrid" | "onsite";
  salary?: string;
  status:
    | "applied"
    | "phone_screen"
    | "interview_1"
    | "interview_2"
    | "interview_3"
    | "final_round"
    | "offer"
    | "rejected"
    | "ghosted";
  applicationDate: string;
  lastUpdateDate: string;
  notes: string;
  jobUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  nextStepDate?: string;
  priority: "low" | "medium" | "high";
}

export const JOB_STATUSES = [
  { id: "applied", label: "Applied", color: "bg-blue-500" },
  { id: "phone_screen", label: "Phone Screen", color: "bg-yellow-500" },
  { id: "interview_1", label: "Interview 1", color: "bg-orange-500" },
  { id: "interview_2", label: "Interview 2", color: "bg-purple-500" },
  { id: "interview_3", label: "Interview 3", color: "bg-pink-500" },
  { id: "final_round", label: "Final Round", color: "bg-indigo-500" },
  { id: "offer", label: "Offer", color: "bg-green-500" },
  { id: "rejected", label: "Rejected", color: "bg-red-500" },
  { id: "ghosted", label: "Ghosted", color: "bg-gray-500" },
] as const;

export const WORK_TYPES = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "On-site" },
] as const;

export const PRIORITIES = [
  { id: "low", label: "Low", color: "text-gray-400" },
  { id: "medium", label: "Medium", color: "text-yellow-400" },
  { id: "high", label: "High", color: "text-red-400" },
] as const;

export function useJobTracker() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load applications on mount
  useEffect(() => {
    if (session?.user?.email) {
      loadApplications();
    } else if (session === null) {
      // Session is loaded but user is not authenticated
      setLoading(false);
    }
  }, [session]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/job-applications?email=${session?.user?.email}`
      );
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      } else {
        throw new Error("Failed to load applications");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (
    applicationData: Omit<
      JobApplication,
      "id" | "applicationDate" | "lastUpdateDate"
    >
  ) => {
    try {
      const newApplication: JobApplication = {
        ...applicationData,
        id: crypto.randomUUID(),
        applicationDate: new Date().toISOString(),
        lastUpdateDate: new Date().toISOString(),
      };

      const response = await fetch("/api/job-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          application: newApplication,
        }),
      });

      if (response.ok) {
        setApplications((prev) => [...prev, newApplication]);
        return newApplication;
      } else {
        throw new Error("Failed to create application");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create application"
      );
      return null;
    }
  };

  const updateApplication = async (
    id: string,
    updates: Partial<JobApplication>
  ) => {
    try {
      const updatedApplication = {
        ...applications.find((app) => app.id === id),
        ...updates,
        lastUpdateDate: new Date().toISOString(),
      } as JobApplication;

      const response = await fetch("/api/job-applications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          applicationId: id,
          updates: updatedApplication,
        }),
      });

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? updatedApplication : app))
        );
        return updatedApplication;
      } else {
        throw new Error("Failed to update application");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update application"
      );
      return null;
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const response = await fetch("/api/job-applications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          applicationId: id,
        }),
      });

      if (response.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        return true;
      } else {
        throw new Error("Failed to delete application");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete application"
      );
      return false;
    }
  };

  const moveApplication = async (
    id: string,
    newStatus: JobApplication["status"]
  ) => {
    return updateApplication(id, { status: newStatus });
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    moveApplication,
    setError,
  };
}
