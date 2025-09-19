"use client";

import { FiLoader } from "react-icons/fi";

// Import components and logic
import { useProjectEvaluation } from "./ProjectEvaluationLogic";
import { ProjectEvaluationUI } from "./ProjectEvaluationComponents";

export default function ProjectEvaluationPage() {
  const {
    projectDescription,
    setProjectDescription,
    selectedPersona,
    setSelectedPersona,
    personas,
    evaluation,
    loading,
    error,
    handleSubmit,
    session,
    status,
  } = useProjectEvaluation();

  // Render a loading indicator if the session status is 'loading'
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <FiLoader className="animate-spin h-8 w-8 text-[#8B5CF6]" />
      </div>
    );
  }

  // Render a message if the user is not logged in
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <p className="text-lg font-medium text-gray-300">
          Please log in to access Project Evaluation.
        </p>
      </div>
    );
  }

  // Render the main content of the page
  return (
    <ProjectEvaluationUI
      projectDescription={projectDescription}
      setProjectDescription={setProjectDescription}
      selectedPersona={selectedPersona}
      setSelectedPersona={setSelectedPersona}
      personas={personas}
      evaluation={evaluation}
      loading={loading}
      error={error}
      handleSubmit={handleSubmit}
    />
  );
}
