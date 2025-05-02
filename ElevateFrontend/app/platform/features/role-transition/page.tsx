// RoleTransitionPage.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChartBarIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

interface TransitionPlan {
  personalizedSummary: {
    transferableSkills: string[];
    skillGapAnalysis: {
      hardSkills: string[];
      softSkills: string[];
    };
    confidenceScore: number;
  };
  skillDevelopment: {
    existingToLeverage: Array<{
      skill: string;
      application: string;
    }>;
    newToAcquire: Array<{
      skill: string;
      priority: string;
      resources: Array<{
        type: string;
        title: string;
        url: string;
      }>;
    }>;
  };
  projectSuggestions: Array<{
    title: string;
    objective: string;
    usesExisting: string[];
    developsNew: string[];
    complexity: string;
  }>;
  actionPlan: {
    immediateActions: Array<{
      action: string;
      reason: string;
      metrics: string[];
    }>;
    phaseBasedTimeline: Array<{
      phase: string;
      duration: string;
      objectives: string[];
      successMarkers: string[];
      confidenceBoosters: string[];
    }>;
  };
  networkingStrategy: {
    targetCompanies: string[];
    keyRolesToConnect: string[];
    communities: Array<{
      name: string;
      type: string;
    }>;
  };
}

export default function RoleTransitionPage() {
  const { data: session, status } = useSession();
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [resumeText, setResumeText] = useState(""); // ← new
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transitionPlan, setTransitionPlan] = useState<TransitionPlan | null>(
    null
  );

  const exampleTransitions = [
    { current: "Frontend Developer", target: "Tech Lead" },
    { current: "Software Engineer", target: "Engineering Manager" },
    { current: "Data Analyst", target: "Data Scientist" },
    { current: "UX Designer", target: "Product Manager" },
    { current: "QA Engineer", target: "DevOps Engineer" },
  ];

  const fetchTransitionPlan = async () => {
    setError("");
    setTransitionPlan(null);

    if (!session?.user?.id_token) {
      setError("You must be logged in to generate a transition plan");
      return;
    }
    if (!currentRole.trim() || !targetRole.trim()) {
      setError("Please fill in both current and target roles");
      return;
    }

    setLoading(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://elevatebackend.onrender.com";

      const res = await fetch(`${backendUrl}/role_transition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.id_token}`,
        },
        body: JSON.stringify({
          currentRole,
          targetRole,
          resume_text: resumeText,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || res.statusText);
      }

      const { plan } = await res.json();
      setTransitionPlan(plan);
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AcademicCapIcon className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Please log in to access Role Transition Guidance.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Role Transition Guidance
          </h1>
          <p className="text-gray-600 text-lg">
            Navigate career changes with structured transition plans
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Role
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="Your current position"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Desired position"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Résumé input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Your Résumé
            </label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Copy and paste your résumé here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={fetchTransitionPlan}
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <AcademicCapIcon className="animate-spin h-5 w-5" />
                Generating Plan...
              </div>
            ) : (
              "Generate Transition Plan"
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleTransitions.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentRole(t.current);
                setTargetRole(t.target);
              }}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-200 transition-colors text-left"
            >
              <span className="text-gray-600 block text-sm">From</span>
              <span className="text-gray-900 font-medium">{t.current}</span>
              <span className="text-gray-600 block mt-2 text-sm">To</span>
              <span className="text-purple-600 font-medium">{t.target}</span>
            </button>
          ))}
        </div>

        {transitionPlan && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8 space-y-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Transition Plan: {currentRole} → {targetRole}
              <span className="ml-4 text-lg font-normal text-purple-600">
                Confidence Score:{" "}
                {Math.round(
                  transitionPlan.personalizedSummary.confidenceScore * 100
                )}
                %
              </span>
            </h2>

            {/* Personalized Summary */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Personalized Analysis
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-700 mb-2">
                    Transferable Skills
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {transitionPlan.personalizedSummary.transferableSkills.map(
                      (skill, i) => (
                        <li key={i} className="text-gray-700">
                          {skill}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-700 mb-2">
                    Skill Gaps
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">
                        Technical:
                      </h5>
                      <ul className="list-disc pl-6">
                        {transitionPlan.personalizedSummary.skillGapAnalysis.hardSkills.map(
                          (skill, i) => (
                            <li key={i} className="text-gray-600">
                              {skill}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">
                        Soft Skills:
                      </h5>
                      <ul className="list-disc pl-6">
                        {transitionPlan.personalizedSummary.skillGapAnalysis.softSkills.map(
                          (skill, i) => (
                            <li key={i} className="text-gray-600">
                              {skill}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Skill Development */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Skill Development Plan
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-3">
                    Existing Skills to Leverage
                  </h4>
                  <div className="space-y-4">
                    {transitionPlan.skillDevelopment.existingToLeverage.map(
                      (skill, i) => (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-lg shadow-sm"
                        >
                          <p className="font-medium text-gray-800">
                            {skill.skill}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {skill.application}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-3">
                    New Skills to Acquire
                  </h4>
                  <div className="space-y-4">
                    {transitionPlan.skillDevelopment.newToAcquire.map(
                      (skill, i) => (
                        <div
                          key={i}
                          className="bg-white p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">
                                {skill.skill}
                              </p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  {
                                    High: "bg-red-100 text-red-800",
                                    Medium: "bg-yellow-100 text-yellow-800",
                                    Low: "bg-gray-100 text-gray-800",
                                  }[skill.priority]
                                }`}
                              >
                                {skill.priority} Priority
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 space-y-2">
                            {skill.resources.map((resource, j) => (
                              <a
                                key={j}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-blue-600 hover:underline"
                              >
                                <span className="mr-2">📚</span>
                                {resource.title} ({resource.type})
                              </a>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Project Suggestions */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Bridge Projects
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {transitionPlan.projectSuggestions.map((project, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">
                        {project.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.complexity === "Beginner"
                            ? "bg-green-100 text-green-800"
                            : project.complexity === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {project.complexity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {project.objective}
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Uses Existing:
                        </p>
                        <p className="text-sm text-gray-700">
                          {project.usesExisting.join(", ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Develops New:
                        </p>
                        <p className="text-sm text-gray-700">
                          {project.developsNew.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Action Plan */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Action Plan
              </h3>
              <div className="space-y-8">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-700 mb-4">
                    Immediate Actions
                  </h4>
                  <div className="space-y-4">
                    {transitionPlan.actionPlan.immediateActions.map(
                      (action, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <p className="font-medium text-gray-800">
                            {action.action}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.reason}
                          </p>
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500">
                              Success Metrics:
                            </p>
                            <ul className="list-disc pl-6">
                              {action.metrics.map((metric, j) => (
                                <li key={j} className="text-sm text-gray-700">
                                  {metric}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-medium text-gray-800 text-lg">
                    Phase-Based Timeline
                  </h4>
                  {transitionPlan.actionPlan.phaseBasedTimeline.map(
                    (phase, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            {i + 1}
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800">
                              {phase.phase}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {phase.duration}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Objectives
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                              {phase.objectives.map((obj, j) => (
                                <li key={j} className="text-sm text-gray-600">
                                  {obj}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Success Markers
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                              {phase.successMarkers.map((marker, j) => (
                                <li key={j} className="text-sm text-gray-600">
                                  {marker}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Confidence Boosters
                            </p>
                            <ul className="list-disc pl-6 space-y-1">
                              {phase.confidenceBoosters.map((booster, j) => (
                                <li key={j} className="text-sm text-gray-600">
                                  {booster}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </section>

            {/* Networking Strategy */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Networking Strategy
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-3">
                    Target Companies
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {transitionPlan.networkingStrategy.targetCompanies.map(
                      (company, i) => (
                        <li key={i} className="text-gray-700">
                          {company}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <h4 className="font-medium text-pink-700 mb-3">
                    Key Roles to Connect
                  </h4>
                  <ul className="list-disc pl-6 space-y-1">
                    {transitionPlan.networkingStrategy.keyRolesToConnect.map(
                      (role, i) => (
                        <li key={i} className="text-gray-700">
                          {role}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h4 className="font-medium text-teal-700 mb-3">
                    Communities
                  </h4>
                  <div className="space-y-2">
                    {transitionPlan.networkingStrategy.communities.map(
                      (community, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              community.type === "Slack"
                                ? "bg-purple-500"
                                : community.type === "Discord"
                                ? "bg-blue-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {community.name} ({community.type})
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
