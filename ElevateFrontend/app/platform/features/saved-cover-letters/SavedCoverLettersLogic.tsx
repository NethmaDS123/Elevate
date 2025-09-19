"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/components/SidebarContext";

// Define interface for SavedCoverLetter
export interface SavedCoverLetter {
  cover_letter_id: string;
  company_name: string;
  job_title: string;
  cover_letter_content: string;
  createdAt: string;
  updatedAt: string;
}

export function useSavedCoverLetters() {
  const { data: session, status } = useSession();
  const { isOpen } = useSidebar();
  const [coverLetters, setCoverLetters] = useState<SavedCoverLetter[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch saved cover letters
  const fetchCoverLetters = async () => {
    if (!session?.user.id_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://elevatebackend.onrender.com/saved_cover_letters",
        {
          headers: {
            Authorization: `Bearer ${session.user.id_token}`,
          },
        }
      );

      if (response.data.success) {
        setCoverLetters(response.data.cover_letters);
      } else {
        throw new Error("Failed to fetch saved cover letters");
      }
    } catch (err: any) {
      console.error("Fetch cover letters error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to load saved cover letters"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete a cover letter
  const deleteCoverLetter = async (coverLetterId: string) => {
    if (!session?.user.id_token) return;

    setDeleting(coverLetterId);
    setError(null);

    try {
      const response = await axios.delete(
        `https://elevatebackend.onrender.com/delete_cover_letter/${coverLetterId}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.id_token}`,
          },
        }
      );

      if (response.data.success) {
        // Remove the deleted cover letter from the list
        setCoverLetters((prev) =>
          prev.filter((letter) => letter.cover_letter_id !== coverLetterId)
        );
      } else {
        throw new Error("Failed to delete cover letter");
      }
    } catch (err: any) {
      console.error("Delete cover letter error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete cover letter"
      );
    } finally {
      setDeleting(null);
    }
  };

  // Download a cover letter
  const downloadCoverLetter = (coverLetter: SavedCoverLetter) => {
    const content = coverLetter.cover_letter_content;
    const fileName = `${coverLetter.company_name}_${coverLetter.job_title}_cover_letter.txt`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Load cover letters on mount and when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user.id_token) {
      fetchCoverLetters();
    }
  }, [status, session?.user.id_token]);

  return {
    coverLetters,
    loading,
    error,
    deleting,
    deleteCoverLetter,
    downloadCoverLetter,
    fetchCoverLetters,
    session,
    status,
    isOpen,
  };
}
