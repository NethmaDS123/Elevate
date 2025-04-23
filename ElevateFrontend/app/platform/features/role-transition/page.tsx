"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChartBarIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

interface TransitionPlan {
  overview: string;
  skillsToDevelop: {
    technical: string[];
    soft: string[];
  };
  recommendedResources: {
    type: string;
    title: string;
    url: string;
  }[];
  actionSteps: {
    shortTerm: string[];
    longTerm: string[];
  };
  timeline: {
    phase: string;
    duration: string;
    milestones: string[];
  }[];
}

export default function RoleTransitionPage() {
  const { data: session, status } = useSession();
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
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
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const res = await fetch(`${backendUrl}/role_transition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.id_token}`,
        },
        body: JSON.stringify({ currentRole, targetRole }),
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
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Transition Plan: {currentRole} → {targetRole}
            </h2>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Overview
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {transitionPlan.overview}
              </p>
            </section>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Skills to Develop
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Technical
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {transitionPlan.skillsToDevelop.technical.map((s, i) => (
                        <li key={i} className="text-gray-600">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Soft Skills
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {transitionPlan.skillsToDevelop.soft.map((s, i) => (
                        <li key={i} className="text-gray-600">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Recommended Resources
                </h3>
                <div className="space-y-3">
                  {transitionPlan.recommendedResources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      className="p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-200 transition-colors block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-sm text-gray-500">{r.type}</span>
                      <p className="text-gray-900 font-medium">{r.title}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Action Timeline
              </h3>
              <div className="space-y-6">
                {transitionPlan.timeline.map((phase, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {phase.phase}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {phase.duration}
                        </p>
                      </div>
                    </div>
                    <ul className="list-disc pl-6 space-y-1 mt-2">
                      {phase.milestones.map((m, j) => (
                        <li key={j} className="text-gray-600">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
