"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiLoader,
  FiStar,
  FiCheckCircle,
  FiCpu,
  FiChevronDown,
  FiHelpCircle,
  FiClock,
  FiInfo,
  FiExternalLink,
  // FiMessageSquare, // Commented out as it's not used
  FiCode,
} from "react-icons/fi";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  QuestionAnalysis,
  UserAnswerFeedback,
  coreTopicExplanations,
  leetCodePatternExplanations,
  studyRoadmapExplanations,
  behavioralQuestionExplanations,
  starMethodExplanation,
} from "./InterviewPrepLogic";

// ------------------
// Interface Definitions
// ------------------

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  initialOpen?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// ------------------
// Modal Component
// ------------------
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="bg-[#161616] rounded-xl shadow-2xl w-full max-w-2xl relative border border-[#2A2A2A]"
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#2A2A2A]">
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-full hover:bg-[#252525] transition-colors text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 pt-4 text-gray-300 leading-relaxed">{children}</div>
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-gray-300 hover:bg-[#252525] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ------------------
// Accordion Component
// ------------------
export const Accordion = ({
  title,
  children,
  icon,
  initialOpen = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(initialOpen);
  return (
    <div className="bg-[#252525] rounded-xl border border-[#2A2A2A] mb-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-[#8B5CF6] text-lg">{icon}</span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <FiChevronDown
          className={`w-5 h-5 transform transition-transform text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className={`px-5 pb-5 ${isOpen ? "block" : "hidden"} space-y-4`}>
        {children}
      </div>
    </div>
  );
};

// ------------------
// Loading and State Components
// ------------------
export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <FiLoader className="animate-spin h-8 w-8 text-[#8B5CF6]" />
    </div>
  );
}

export function UnauthenticatedState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <p className="text-lg font-medium text-gray-300">
        Please log in to access Interview Preparation.
      </p>
    </div>
  );
}

// ------------------
// Technical Components
// ------------------

// Component to display complexity progress bar
const ComplexityProgress = ({ value }: { value: string }) => {
  const getWidth = (): number => {
    const complexities: { [key: string]: number } = {
      "O(1)": 10,
      "O(log n)": 20,
      "O(n)": 40,
      "O(n log n)": 60,
      "O(n²)": 80,
      "O(2ⁿ)": 95,
      "O(n!)": 100,
    };
    return complexities[value] || 50;
  };

  return (
    <div className="mt-2 bg-[#333333] rounded-full h-2">
      <div
        className="bg-[#8B5CF6] h-2 rounded-full transition-all duration-500"
        style={{ width: `${getWidth()}%` }}
      ></div>
    </div>
  );
};

// Component to display question analysis breakdown
export const QuestionBreakdown = ({
  analysis,
}: {
  analysis: QuestionAnalysis;
}) => {
  const nested = analysis.analysis || {};
  const approachSteps = nested.approach || [];
  const edgeCases = nested.edgeCases || [];
  const sampleSolution = nested.sampleSolution;

  return (
    <div className="bg-[#161616] rounded-xl border border-[#2A2A2A] p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <FiHelpCircle className="text-[#8B5CF6] w-6 h-6" />
        <h3 className="text-xl font-semibold text-white">Problem Breakdown</h3>
      </div>
      <Accordion title="Step-by-Step Approach" icon="🧠" initialOpen={true}>
        <div className="space-y-4">
          {approachSteps.length > 0 ? (
            approachSteps.map((step, index) => (
              <div key={index} className="group relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center text-[#8B5CF6] text-sm">
                  {index + 1}
                </div>
                <div className="p-4 bg-[#1A1A1A] border border-[#333333] rounded-lg hover:border-[#8B5CF6]/30 transition-colors">
                  <h4 className="font-medium text-white mb-2">{step.step}</h4>
                  <p className="text-gray-400 text-sm mb-3">{step.reasoning}</p>
                  <div className="flex items-center gap-2 text-xs text-[#8B5CF6]">
                    <FiCode />
                    <span className="font-mono">
                      Key Operation: {step.keyOperation}
                    </span>
                  </div>
                  {index < approachSteps.length - 1 && (
                    <div className="absolute -bottom-4 left-3 w-px h-8 bg-[#333333] group-hover:bg-[#8B5CF6]/30"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No approach data available.</p>
          )}
        </div>
      </Accordion>

      <Accordion title="Complexity Analysis" icon="⏳">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-[#8B5CF6] flex items-center gap-2">
                <FiClock className="inline-block" /> Time Complexity
              </h4>
              <span className="px-2 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full text-xs">
                {nested.complexityAnalysis?.time.value || "N/A"}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              {nested.complexityAnalysis?.time.explanation || ""}
            </p>
            <ComplexityProgress
              value={nested.complexityAnalysis?.time.value || ""}
            />
          </div>
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-[#22C55E] flex items-center gap-2">
                <FiCpu className="inline-block" /> Space Complexity
              </h4>
              <span className="px-2 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full text-xs">
                {nested.complexityAnalysis?.space.value || "N/A"}
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              {nested.complexityAnalysis?.space.explanation || ""}
            </p>
            <ComplexityProgress
              value={nested.complexityAnalysis?.space.value || ""}
            />
          </div>
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
            <h4 className="text-sm font-medium text-[#F97316] mb-2">
              Approach Comparison
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <FiInfo className="text-[#F97316]" />
              <p className="text-gray-300">
                {nested.complexityAnalysis?.comparison || ""}
              </p>
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion title="Edge Cases & Solutions" icon="⚠️">
        <div className="space-y-4">
          {edgeCases.length > 0 ? (
            edgeCases.map((edgeCase, index) => (
              <div
                key={index}
                className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 text-sm">
                    {index + 1}
                  </div>
                  <h4 className="font-medium text-red-400">{edgeCase.case}</h4>
                </div>
                <p className="text-gray-300 text-sm ml-8 mb-2">
                  {edgeCase.handling}
                </p>
                <div className="ml-8">
                  <SyntaxHighlighter
                    language="python"
                    style={atomOneDark}
                    className="rounded-lg text-sm p-3"
                  >
                    {edgeCase.testExample}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No edge case data available.</p>
          )}
        </div>
      </Accordion>

      <Accordion title="Optimized Solution" icon="🚀">
        <div className="space-y-6">
          <div className="rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language="python"
              style={atomOneDark}
              className="text-sm p-4"
              showLineNumbers
            >
              {sampleSolution
                ? sampleSolution.code
                : "No solution code available."}
            </SyntaxHighlighter>
          </div>
          <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
            <h4 className="text-sm font-medium text-[#8B5CF6] mb-3">
              Code Explanation
            </h4>
            <div className="space-y-2 text-gray-300 text-sm">
              {sampleSolution && sampleSolution.codeExplanation
                ? sampleSolution.codeExplanation.split("\n").map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="text-[#8B5CF6]">▸</div>
                      <p>{line}</p>
                    </div>
                  ))
                : "No code explanation available."}
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
};

// Component to display feedback on user's answer
export const AnswerFeedback = ({
  feedback,
}: {
  feedback: UserAnswerFeedback;
}) => (
  <div className="bg-[#161616] rounded-xl border border-[#2A2A2A] p-6 mt-4">
    <div className="flex items-center gap-3 mb-6">
      <FiStar className="text-[#22C55E] w-6 h-6" />
      <h3 className="text-xl font-semibold text-white">Detailed Feedback</h3>
      <div className="ml-auto flex items-center gap-2">
        <div className="px-3 py-1 bg-[#22C55E]/20 text-[#22C55E] rounded-full text-sm">
          Score: {feedback.score.overall}/10
        </div>
        <div className="px-3 py-1 bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full text-sm">
          Correctness: {feedback.score.categories.correctness}/5
        </div>
      </div>
    </div>
    <Accordion title="Feedback Breakdown" icon="📊" initialOpen={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
          <h4 className="text-sm font-medium text-[#22C55E] mb-3">Strengths</h4>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <FiCheckCircle className="text-[#22C55E] mt-1" />
                <p className="text-gray-300">{strength}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
          <h4 className="text-sm font-medium text-yellow-400 mb-3">
            Improvement Areas
          </h4>
          <div className="space-y-3">
            {feedback.improvementAreas.map((area, index) => (
              <div key={index} className="border-l-4 border-red-400/50 pl-3">
                <div className="flex items-center gap-2 text-red-400">
                  <FiAlertTriangle />
                  <span className="font-medium">{area.issue}</span>
                  <span className="text-xs px-2 py-1 bg-red-400/20 rounded-full">
                    {area.severity} Priority
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1 ml-6">
                  {area.suggestion}
                </p>
                {area.example && (
                  <div className="ml-6 mt-2">
                    <SyntaxHighlighter
                      language="python"
                      style={atomOneDark}
                      className="rounded-lg text-xs p-2"
                    >
                      {area.example}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Accordion>
    <Accordion title="Code Quality Assessment" icon="📝">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
          <h4 className="text-sm font-medium text-[#8B5CF6] mb-2">Structure</h4>
          <p className="text-gray-300 text-sm">
            {feedback.codeQuality.structure}
          </p>
        </div>
        <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
          <h4 className="text-sm font-medium text-[#22C55E] mb-2">Naming</h4>
          <p className="text-gray-300 text-sm">{feedback.codeQuality.naming}</p>
        </div>
        <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#333333]">
          <h4 className="text-sm font-medium text-[#F97316] mb-2">
            Best Practices
          </h4>
          <p className="text-gray-300 text-sm">
            {feedback.codeQuality.bestPractices}
          </p>
        </div>
      </div>
    </Accordion>
    <Accordion title="Recommended Resources" icon="📚">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {feedback.recommendedResources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-[#1A1A1A] border border-[#333333] rounded-lg hover:border-[#8B5CF6]/30 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-white block">{resource.title}</span>
              <span className="text-gray-400 text-sm">{resource.type}</span>
            </div>
            <FiExternalLink className="text-gray-400" />
          </a>
        ))}
      </div>
    </Accordion>
  </div>
);

// ------------------
// Technical Guide Component
// ------------------
export const TechnicalGuide = ({
  openModal,
}: {
  openModal: (title: string, content: string) => void;
}) => (
  <div className="bg-[#161616] rounded-2xl shadow-lg border border-[#2A2A2A] p-8 mb-8">
    <h2 className="text-3xl font-bold text-white mb-8">
      Technical Interview Guide
    </h2>
    <div className="space-y-4">
      <Accordion title="Core Topics" icon="📚" initialOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
          {[
            { title: "Arrays" },
            { title: "Linked Lists" },
            { title: "Trees" },
            { title: "Graphs" },
            { title: "Hash Tables" },
            { title: "Stacks" },
            { title: "Queues" },
            { title: "Heaps" },
            { title: "Recursion" },
            { title: "Greedy" },
            { title: "Dynamic Programming" },
            { title: "Sorting Algorithms" },
            { title: "Searching Algorithms" },
            { title: "Bit Manipulation" },
          ].map((topic) => (
            <div
              key={topic.title}
              onClick={() =>
                openModal(topic.title, coreTopicExplanations[topic.title])
              }
              className="p-4 bg-[#252525] rounded-lg cursor-pointer hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#8B5CF6]/30 transition-colors"
            >
              <h4 className="font-medium text-white mb-2">
                {topic.title}{" "}
                <FiInfo className="inline-block text-[#8B5CF6] ml-1" />
              </h4>
              <p className="text-gray-400 text-sm">
                Click for detailed explanation.
              </p>
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion title="LeetCode Patterns" icon="🔍">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2">
          {[
            "Sliding Window",
            "Two Pointers",
            "Merge Intervals",
            "Tree BFS",
            "Tree DFS",
            "Binary Search",
            "Dynamic Programming",
            "Backtracking",
            "Greedy",
          ].map((pattern) => (
            <div
              key={pattern}
              onClick={() =>
                openModal(pattern, leetCodePatternExplanations[pattern])
              }
              className="p-3 bg-[#252525] border border-[#8B5CF6]/20 rounded-lg text-sm font-medium text-[#8B5CF6] cursor-pointer hover:bg-[#2A2A2A] hover:border-[#8B5CF6]/40 transition-colors"
            >
              {pattern} <FiInfo className="inline-block text-[#8B5CF6] ml-1" />
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion title="Study Roadmap" icon="🗺️">
        <div className="space-y-4 p-2">
          {[
            {
              step: "Step 1",
              focus: "Master Fundamental Data Structures",
              tasks: [
                "Arrays",
                "Linked Lists",
                "Stacks & Queues",
                "Hash Tables",
              ],
            },
            {
              step: "Step 2",
              focus: "Develop Algorithmic Foundations",
              tasks: [
                "Sorting Algorithms",
                "Binary Search",
                "Complexity Analysis",
              ],
            },
            {
              step: "Step 3",
              focus: "Advance into Trees and Graphs",
              tasks: ["Binary Trees", "Heaps", "BFS & DFS", "Graphs"],
            },
            {
              step: "Step 4",
              focus: "Master Dynamic Programming and Recursion",
              tasks: [
                "DP Techniques",
                "Memoization & Tabulation",
                "Classic DP Problems",
              ],
            },
            {
              step: "Step 5",
              focus: "Solve Pattern-Based Problems",
              tasks: [
                "Sliding Window",
                "Two Pointers",
                "Fast & Slow Pointers",
                "Prefix Sums",
              ],
            },
            {
              step: "Step 6",
              focus: "Enhance Problem-Solving Speed and Accuracy",
              tasks: [
                "Timed Questions",
                "Accuracy & Speed",
                "Solution Reviews",
              ],
            },
            {
              step: "Step 7",
              focus: "Build System Design Foundations",
              tasks: [
                "Scalability",
                "Databases",
                "APIs & Microservices",
                "Distributed Systems",
              ],
            },
            {
              step: "Step 8",
              focus: "Apply Knowledge to Real-World Projects",
              tasks: [
                "Full-stack Projects",
                "Backend Development",
                "Portfolio Building",
              ],
            },
            {
              step: "Step 9",
              focus: "Prepare for Behavioral and Communication Skills",
              tasks: [
                "STAR Method",
                "Communication Skills",
                "Common Behavioral Questions",
              ],
            },
            {
              step: "Step 10",
              focus: "Engage in Continuous Improvement",
              tasks: [
                "Performance Review",
                "Identify Weaknesses",
                "Iterative Practice",
              ],
            },
          ].map((step) => (
            <div
              key={step.step}
              onClick={() =>
                openModal(
                  `${step.step}: ${step.focus}`,
                  studyRoadmapExplanations[`${step.step}: ${step.focus}`]
                )
              }
              className="p-4 bg-[#252525] rounded-lg cursor-pointer hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#8B5CF6]/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="font-semibold text-[#8B5CF6]">{step.step}</div>
              </div>
              <h4 className="text-white mb-2">{step.focus}</h4>
              <ul className="grid grid-cols-2 gap-2">
                {step.tasks.map((task) => (
                  <li
                    key={task}
                    className="text-gray-300 text-sm px-3 py-1.5 bg-[#1A1A1A] rounded-md border border-[#333333]"
                  >
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion title="Resources" icon="📖">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">
          {[
            { title: "NeetCode Roadmap", url: "#" },
            { title: "Blind 75 LeetCode", url: "#" },
            { title: "Grokking Interviews", url: "#" },
          ].map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#252525] border border-[#333333] rounded-lg hover:border-[#8B5CF6]/30 transition-colors flex items-center justify-between"
            >
              <span className="text-white">{resource.title}</span>
              <FiExternalLink className="text-gray-400" />
            </a>
          ))}
        </div>
      </Accordion>
    </div>
  </div>
);

export const BehavioralGuide = ({
  openModal,
}: {
  openModal: (title: string, content: string) => void;
}) => (
  <div className="bg-[#161616] rounded-2xl shadow-lg border border-[#2A2A2A] p-8 mb-8">
    <h2 className="text-3xl font-bold text-white mb-8">
      Behavioral Interview Guide
    </h2>
    <div className="space-y-4">
      <Accordion title="Common Questions" icon="💬" initialOpen={false}>
        <div className="space-y-3 p-2">
          {[
            "Tell me about a challenge you overcame",
            "Describe a leadership experience",
            "How do you handle conflicting priorities?",
            "Can you give an example of a time you failed?",
          ].map((question, index) => (
            <div
              key={index}
              onClick={() =>
                openModal(question, behavioralQuestionExplanations[question])
              }
              className="p-4 bg-[#252525] rounded-lg cursor-pointer hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#22C55E]/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="font-semibold text-[#22C55E]">
                  Q{index + 1}.
                </div>
                <p className="text-white">{question}</p>
                <FiInfo className="text-[#8B5CF6]" />
              </div>
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion title="STAR Method" icon="⭐">
        <div className="grid grid-cols-1 gap-4 p-2">
          <div
            onClick={() => openModal("STAR Method", starMethodExplanation)}
            className="p-4 bg-[#252525] rounded-lg cursor-pointer hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#22C55E]/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-[#22C55E]/20 rounded-full flex items-center justify-center font-bold text-[#22C55E]" />
              <h4 className="font-semibold text-white">STAR</h4>
            </div>
            <p className="text-gray-300 text-sm">
              Click to read detailed explanation of the STAR method.
            </p>
          </div>
        </div>
      </Accordion>
      <Accordion title="Example Answers" icon="📝">
        <div className="space-y-4 p-2">
          <div
            onClick={() =>
              openModal(
                "Team Conflict Example",
                `**Situation:** During a project, our team faced a major conflict regarding design choices.\n\n**Task:** I was tasked with facilitating a resolution while ensuring project deadlines were met.\n\n**Action:** I organized a meeting, encouraged open dialogue, and proposed a compromise by combining the best aspects of both designs.\n\n**Result:** The team reached a consensus, and the project was delivered successfully with improved design integration.`
              )
            }
            className="p-4 bg-[#252525] rounded-lg cursor-pointer hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#22C55E]/30 transition-colors"
          >
            <h4 className="font-semibold text-white mb-2">
              Team Conflict Example
            </h4>
            <p className="text-gray-300">
              Click to see a detailed STAR-based explanation.
            </p>
          </div>
          <div
            onClick={() =>
              openModal(
                "Handling Failure Example",
                `**Situation:** I was leading a project where we missed the initial deadline.\n\n**Task:** My task was to identify the root cause and set the team on a new path.\n\n**Action:** I held a retrospective meeting, identified process bottlenecks, and implemented daily check-ins to monitor progress.\n\n**Result:** The project was completed with only a slight delay, and our processes improved significantly for future projects.`
              )
            }
            className="p-4 bg-[#252525] rounded-lg cursor-pointer hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#22C55E]/30 transition-colors"
          >
            <h4 className="font-semibold text-white mb-2">
              Handling Failure Example
            </h4>
            <p className="text-gray-300">
              Click to see another STAR-based detailed answer.
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  </div>
);
