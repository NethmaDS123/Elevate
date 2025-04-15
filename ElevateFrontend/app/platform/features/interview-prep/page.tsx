"use client";

import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  FiLoader,
  FiCode,
  FiMessageSquare,
  FiChevronDown,
  FiExternalLink,
  FiStar,
  FiUsers,
  FiBookOpen,
  FiHelpCircle,
  FiAlertTriangle,
  FiEdit,
  FiCheckCircle,
  FiInfo,
  FiClock,
  FiCpu,
} from "react-icons/fi";
import { motion } from "framer-motion";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

// ------------------
// Type Definitions
// ------------------

interface ApproachStep {
  step: string;
  reasoning: string;
  keyOperation: string;
}

interface ComplexityAnalysis {
  time: {
    value: string;
    explanation: string;
  };
  space: {
    value: string;
    explanation: string;
  };
  comparison: string;
}

interface EdgeCase {
  case: string;
  handling: string;
  testExample: string;
}

interface SampleSolution {
  code: string;
  codeExplanation: string;
}

interface OptimizationTip {
  tip: string;
  benefit: string;
  tradeoff: string;
}

interface QuestionAnalysis {
  question: string;
  // The actual analysis data is nested under "analysis"
  analysis?: {
    approach?: ApproachStep[];
    complexityAnalysis?: ComplexityAnalysis;
    edgeCases?: EdgeCase[];
    sampleSolution?: SampleSolution;
    optimizationTips?: OptimizationTip[];
    commonPitfalls?: CommonPitfall[];
    [key: string]: any;
  };
}

interface FeedbackScore {
  overall: number;
  categories: {
    correctness: number;
    efficiency: number;
    readability: number;
  };
}

interface ImprovementArea {
  issue: string;
  severity: string;
  suggestion: string;
  example: string;
}

interface UserAnswerFeedback {
  score: FeedbackScore;
  strengths: string[];
  improvementAreas: ImprovementArea[];
  alternativeApproaches: string[];
  codeQuality: {
    structure: string;
    naming: string;
    bestPractices: string;
  };
  recommendedResources: {
    type: string;
    title: string;
    url: string;
  }[];
}

interface InterviewPrepResponse {
  questions: string[];
  type: "technical" | "behavioral";
}

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

// CommonPitfalls interface
interface CommonPitfall {
  mistake: string;
  consequence: string;
  prevention: string;
}

// ------------------
// Detailed Explanation Data
// ------------------

const coreTopicExplanations: { [key: string]: string } = {
  Arrays:
    "Arrays are contiguous memory structures used to store multiple elements of the same type. They allow fast random access (O(1)) by index. They're fundamental for implementing more complex data structures like hash tables, stacks, queues, and heaps. Common operations include insertion, deletion, searching, and sorting.",
  "Linked Lists":
    "Linked lists are linear data structures composed of nodes, where each node contains data and a reference (pointer) to the next node. They provide efficient insertion and deletion (O(1)) at any point in the list, but searching remains linear (O(n)). They're useful for implementing dynamic data structures like stacks, queues, and graphs.",
  Trees:
    "Trees are hierarchical structures consisting of nodes connected by edges, starting from a root node. Common types include binary trees, binary search trees (BST), AVL trees, and heaps. Trees enable efficient data operations like insertion, deletion, and lookup, typically in O(log n), and are crucial for representing hierarchical data such as file systems and databases.",
  Graphs:
    "Graphs are flexible data structures composed of nodes (vertices) and connections (edges). They model complex relationships and networks, such as social media interactions, GPS navigation, and web page linking. Algorithms used with graphs include breadth-first search (BFS), depth-first search (DFS), Dijkstra's algorithm, and topological sorting.",
  "Hash Tables":
    "Hash tables are data structures providing extremely fast lookup, insertion, and deletion (O(1) average case). They work by computing a hash function on keys, which maps the data to specific indices in an array. Hash tables underpin many data-intensive applications, like databases, caches, and language interpreters.",
  Stacks:
    "Stacks follow a Last-In-First-Out (LIFO) principle, meaning the last item added is the first one to be removed. Typical operations are push, pop, and peek, all performed in O(1). Stacks are critical in scenarios involving recursion, backtracking algorithms, expression evaluation, syntax parsing, and undo operations.",
  Queues:
    "Queues follow a First-In-First-Out (FIFO) structure, meaning the earliest inserted item is the first to be removed. Operations like enqueue, dequeue, and peek run efficiently in O(1). Queues are essential for task scheduling, buffering, streaming data, and breadth-first traversal of trees and graphs.",
  Heaps:
    "Heaps are specialized binary trees used primarily for priority queue implementations. They efficiently provide quick access (O(1)) to the maximum or minimum element, while insertion and deletion operations take O(log n). Heaps are often utilized in algorithms like heap sort, Dijkstra’s shortest-path, and priority-driven scheduling.",
  Recursion:
    "Recursion is a programming technique where a function calls itself to break a problem into smaller subproblems. It simplifies complex problems, particularly those naturally hierarchical or repetitive, such as traversing trees/graphs, divide-and-conquer algorithms, dynamic programming, permutations, and backtracking solutions.",
  Greedy:
    "Greedy algorithms iteratively make locally optimal choices, hoping to achieve a globally optimal solution. They are efficient and simple to implement but don't guarantee optimality for all problems. Greedy methods are particularly useful for problems like coin change, job scheduling, Huffman encoding, and finding minimum spanning trees.",
  "Dynamic Programming":
    "Dynamic programming solves complex problems by breaking them into simpler overlapping subproblems. It stores solutions to these subproblems (memoization) to avoid redundant computations, thus improving efficiency drastically (often from exponential to polynomial complexity). Common examples include Fibonacci sequences, knapsack problems, longest common subsequences, and matrix-chain multiplication.",
  "Sorting Algorithms":
    "Sorting algorithms arrange data into an ordered sequence. Common algorithms include Quick Sort, Merge Sort, Heap Sort, and Bubble Sort. Efficient sorting is crucial as it optimizes subsequent search operations and data organization. They vary widely in complexity, ranging from O(n log n) for efficient algorithms (Quick Sort, Merge Sort) to O(n²) for simpler algorithms like Bubble Sort.",
  "Searching Algorithms":
    "Searching algorithms find specific elements within data structures. Common examples include Linear Search (O(n)), Binary Search (O(log n)), and specialized algorithms like BFS and DFS for trees and graphs. Efficient searching is fundamental for data retrieval tasks, indexing systems, and database operations.",
  "Bit Manipulation":
    "Bit manipulation involves performing operations directly on binary digits (bits) of integers. It includes operations like AND, OR, XOR, shifting, and masking. Bit manipulation is highly efficient, commonly utilized in embedded systems, low-level programming, cryptography, error detection algorithms, and performance-critical applications.",
};

const leetCodePatternExplanations: { [key: string]: string } = {
  "Sliding Window":
    "The Sliding Window technique solves problems involving contiguous subarrays or substrings by maintaining two pointers or indices that represent the bounds of a 'window'. The window dynamically expands or shrinks based on the problem's conditions, optimizing time complexity from O(n²) to O(n). Common applications include substring search, maximum subarray sums, and finding the longest unique character substring.",
  "Two Pointers":
    "The Two Pointers technique leverages two pointers traversing a data structure from different directions or at varying speeds, effectively reducing unnecessary computations. It’s often employed in sorted arrays or linked lists to find pairs meeting certain conditions (e.g., sum pairs, palindrome checks, or detecting cycles), usually with linear (O(n)) complexity.",
  "Merge Intervals":
    "Merge Intervals solves problems involving overlapping intervals by sorting intervals based on their start or end points and merging overlaps sequentially. It's commonly applied in scheduling scenarios, meeting rooms allocation, and calendar event management. The typical complexity is O(n log n), driven by the initial sorting step.",
  "Tree BFS":
    "Tree Breadth-First Search (BFS) explores nodes level-by-level using a queue, making it ideal for finding shortest paths or minimum depth in trees and graphs. It guarantees the shortest path in unweighted graphs and is often used in network broadcasting, social networks traversal, and shortest-path algorithms. Complexity is typically O(V + E) for graphs.",
  "Tree DFS":
    "Tree Depth-First Search (DFS) explores nodes by going deep into each branch before backtracking. DFS can be implemented recursively or using a stack. It's extensively used in path-finding, topological sorting, detecting cycles, and exploring connected components. DFS's complexity is usually O(V + E) in graphs, making it efficient for traversal and exhaustive search problems.",
  "Binary Search":
    "Binary Search is an efficient divide-and-conquer algorithm for locating an element within a sorted array by repeatedly dividing the search space in half, reducing the complexity from O(n) (linear search) to O(log n). This technique is crucial for problems involving sorted data or searching within specific numeric ranges.",
  "Dynamic Programming":
    "Dynamic Programming (DP) solves complex problems by breaking them down into simpler overlapping subproblems, solving each subproblem only once (via memoization or tabulation) and storing their solutions to avoid redundant calculations. DP is especially useful for optimization problems, such as longest common subsequence, edit distance, and knapsack problems. DP solutions typically improve complexity from exponential to polynomial time.",
  Backtracking:
    "Backtracking systematically searches for all or some solutions to problems by incrementally building candidates and abandoning them ('backtracking') once they fail to satisfy the problem constraints. It's commonly used for constraint satisfaction problems, such as puzzles, permutations, combinations, Sudoku, and N-Queens problems. While the worst-case complexity can be exponential, pruning strategies often optimize performance.",
  Greedy:
    "Greedy algorithms solve optimization problems by making locally optimal choices at each step, with the hope that these choices lead to a globally optimal solution. They're often simpler and faster than dynamic programming but don't guarantee optimality for all problems. Common uses include activity selection, coin change (in specific currencies), Huffman coding, and minimum spanning trees.",
  "Fast and Slow Pointers":
    "The Fast and Slow Pointers pattern uses two pointers moving through a structure at different speeds (often one at twice the speed of the other). It's effective for cycle detection (Floyd’s Tortoise and Hare algorithm), finding middle elements, and determining palindromes in linked lists. The approach has linear complexity (O(n)) and minimal memory usage.",
  "Topological Sort":
    "Topological sorting orders nodes in a Directed Acyclic Graph (DAG) so that every directed edge from node A to node B implies A appears before B. This pattern is crucial for scheduling tasks, detecting cycles in dependencies, and build systems. Typical algorithms include Kahn's algorithm and DFS-based methods, both with O(V + E) complexity.",
  "Bit Manipulation":
    "Bit Manipulation involves direct operations on individual bits of binary numbers (e.g., AND, OR, XOR, bit shifting). It's efficient in memory and computational speed, crucial for solving problems related to bitwise operations, subset generation, missing numbers, single-number identification, and low-level systems programming tasks. Operations usually have O(1) time complexity.",
  "Union Find":
    "Union-Find (Disjoint Set Union) is used to manage disjoint sets, efficiently performing two operations: finding the set a particular element belongs to, and uniting two sets. Commonly used in graph connectivity, cycle detection, and clustering algorithms, it achieves near-constant complexity per operation (approximately O(α(n)), where α is the inverse Ackermann function).",
  "Prefix Sum":
    "Prefix Sum (or cumulative sum) stores the sum of elements up to each index, enabling rapid calculations of range sums or averages. It optimizes range query problems from O(n²) to O(n). Frequently applied in subarray sum problems, range sum queries, and certain optimization scenarios like the equilibrium index problem.",
};

const studyRoadmapExplanations: { [key: string]: string } = {
  "Step 1: Master Fundamental Data Structures":
    "Gain complete proficiency in essential data structures such as Arrays, Linked Lists, Stacks, Queues, and Hash Tables. Understand their operations, complexity, implementation details, and common applications. Solve problems to master operations like insertion, deletion, traversal, and searching.",
  "Step 2: Develop Algorithmic Foundations":
    "Deeply understand key algorithmic concepts like Sorting (Merge Sort, Quick Sort, Heap Sort), Searching (Binary Search, Linear Search), and Recursion. Learn how to analyze complexity (time and space) rigorously. Solve a wide range of basic algorithm problems to internalize these concepts thoroughly.",
  "Step 3: Advance into Trees and Graphs":
    "Study advanced data structures including Binary Trees, Binary Search Trees, Heaps, AVL Trees, and Graphs. Practice key algorithms such as Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's algorithm, Topological Sorting, and Graph traversals. Focus on understanding problem-solving techniques involving these structures deeply.",
  "Step 4: Master Dynamic Programming and Recursion":
    "Intensively practice Dynamic Programming (DP) and Recursive algorithms. Identify overlapping subproblems, optimal substructure properties, memoization, and tabulation techniques. Solve classic DP problems (Knapsack, Longest Common Subsequence, Fibonacci sequences) and strengthen your recursive reasoning.",
  "Step 5: Solve Pattern-Based Problems":
    "Master commonly tested LeetCode problem patterns including Sliding Window, Two Pointers, Merge Intervals, Fast and Slow Pointers, and Prefix Sums. Recognize patterns quickly, enabling you to approach unseen problems confidently and effectively during interviews.",
  "Step 6: Enhance Problem-Solving Speed and Accuracy":
    "Regularly practice mock interviews under timed conditions. Aim to solve medium-level questions within 20-30 minutes, clearly explaining your approach. Review solutions thoroughly to understand optimal solutions, edge cases, and alternative approaches. Aim for consistent accuracy and efficient coding style.",
  "Step 7: Build System Design Foundations":
    "Gain foundational knowledge of System Design, including scalability, load balancing, caching, database management, API design, microservices architecture, and distributed systems. Understand how to approach open-ended design questions systematically, articulate trade-offs, and propose scalable solutions clearly.",
  "Step 8: Apply Knowledge to Real-World Projects":
    "Work on real-world software engineering projects or personal side-projects. Engage in full-stack or backend development, using technologies relevant to your targeted roles. Practical experience demonstrates proficiency and deepens understanding of technical concepts used during technical discussions.",
  "Step 9: Prepare for Behavioral and Communication Skills":
    "Refine your ability to clearly explain technical solutions and past project experiences using structured frameworks like STAR. Demonstrate critical soft skills such as communication, collaboration, leadership, and adaptability. Practice common behavioral questions frequently asked by top tech companies.",
  "Step 10: Engage in Continuous Improvement":
    "Constantly refine and revisit your weaker areas. Regularly participate in mock interviews, analyze your performance, and iterate. Review past interview experiences, gather feedback, and continuously adapt your preparation strategy to address identified gaps, optimizing your readiness for interviews at leading tech companies.",
};

const behavioralQuestionExplanations: { [key: string]: string } = {
  "Tell me about a challenge you overcame":
    "Explain a real-life challenge, how you approached it, the actions you took, and what you learned. Focus on problem-solving and resilience.",
  "Describe a leadership experience":
    "Detail a scenario where you led a team or project, the challenges you faced, and the impact your leadership had on the outcome.",
  "How do you handle conflicting priorities?":
    "Discuss your approach to time management, prioritization, and communication when dealing with multiple tasks or conflicts.",
  "Can you give an example of a time you failed?":
    "Share a failure and the steps you took to overcome it, what you learned, and how it has influenced your work ethic.",
};

const starMethodExplanation = `The STAR method is a structured manner of responding to behavioral interview questions by discussing the:
  - **Situation**: Set the context and describe the background.
  - **Task**: Explain the task or challenge that was involved.
  - **Action**: Describe the specific actions you took to address it.
  - **Result**: Share the outcomes or results of your actions, quantifying your success when possible.
  This approach helps in delivering clear and concise answers.`;

// ------------------
// Modal Component
// ------------------

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative border border-gray-100"
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 -m-2 rounded-full hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900"
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
        <div className="p-6 pt-4 text-gray-700 leading-relaxed">{children}</div>
        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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

const Accordion = ({
  title,
  children,
  icon,
  initialOpen = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-600 text-lg">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <FiChevronDown
          className={`w-5 h-5 transform transition-transform ${
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
// Technical Components
// ------------------

const ComplexityProgress = ({ value }: { value: string }) => {
  const getWidth = (complexity: string) => {
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
    <div className="mt-2 bg-blue-100 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${getWidth(value)}%` }}
      ></div>
    </div>
  );
};

const QuestionBreakdown = ({ analysis }: { analysis: QuestionAnalysis }) => {
  // Use nested "analysis" if available.
  const nested = analysis.analysis || {};
  const approachSteps = nested.approach || [];
  const complexity = nested.complexityAnalysis;
  const edgeCases = nested.edgeCases || [];
  const sampleSolution = nested.sampleSolution;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <FiHelpCircle className="text-blue-600 w-6 h-6" />
        <h3 className="text-xl font-semibold text-gray-900">
          Problem Breakdown
        </h3>
      </div>
      <Accordion title="Step-by-Step Approach" icon="🧠" initialOpen={true}>
        <div className="space-y-4">
          {approachSteps.length > 0 ? (
            approachSteps.map((step, index) => (
              <div key={index} className="group relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 text-sm">
                  {index + 1}
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {step.step}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">{step.reasoning}</p>
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <FiCode />
                    <span className="font-mono">
                      Key Operation: {step.keyOperation}
                    </span>
                  </div>
                  {index < approachSteps.length - 1 && (
                    <div className="absolute -bottom-4 left-3 w-px h-8 bg-gray-200 group-hover:bg-blue-200"></div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No approach data available.</p>
          )}
        </div>
      </Accordion>

      <Accordion title="Complexity Analysis" icon="⏳">
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <FiClock className="inline-block" /> Time Complexity
              </h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {complexity?.time.value || "N/A"}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              {complexity?.time.explanation || ""}
            </p>
            <ComplexityProgress value={complexity?.time.value || ""} />
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-purple-800 flex items-center gap-2">
                <FiCpu className="inline-block" /> Space Complexity
              </h4>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {complexity?.space.value || "N/A"}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              {complexity?.space.explanation || ""}
            </p>
            <ComplexityProgress value={complexity?.space.value || ""} />
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              Approach Comparison
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <FiInfo className="text-green-600" />
              <p className="text-gray-700">{complexity?.comparison || ""}</p>
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion title="Edge Cases & Solutions" icon="⚠️">
        <div className="space-y-4">
          {edgeCases.length > 0 ? (
            edgeCases.map((edgeCase, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-800 text-sm">
                    {index + 1}
                  </div>
                  <h4 className="font-medium text-red-800">{edgeCase.case}</h4>
                </div>
                <p className="text-gray-700 text-sm ml-8 mb-2">
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
            <p className="text-gray-600">No edge case data available.</p>
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
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-3">
              Code Explanation
            </h4>
            <div className="space-y-2 text-gray-700 text-sm">
              {sampleSolution && sampleSolution.codeExplanation
                ? sampleSolution.codeExplanation.split("\n").map((line, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="text-blue-600">▸</div>
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

const AnswerFeedback = ({ feedback }: { feedback: UserAnswerFeedback }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
    <div className="flex items-center gap-3 mb-6">
      <FiStar className="text-green-600 w-6 h-6" />
      <h3 className="text-xl font-semibold text-gray-900">Detailed Feedback</h3>
      <div className="ml-auto flex items-center gap-2">
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Score: {feedback.score.overall}/10
        </div>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Correctness: {feedback.score.categories.correctness}/5
        </div>
      </div>
    </div>
    <Accordion title="Feedback Breakdown" icon="📊" initialOpen={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-3">Strengths</h4>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <FiCheckCircle className="text-green-600 mt-1" />
                <p className="text-gray-700">{strength}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-3">
            Improvement Areas
          </h4>
          <div className="space-y-3">
            {feedback.improvementAreas.map((area, index) => (
              <div key={index} className="border-l-4 border-red-200 pl-3">
                <div className="flex items-center gap-2 text-red-800">
                  <FiAlertTriangle />
                  <span className="font-medium">{area.issue}</span>
                  <span className="text-xs px-2 py-1 bg-red-100 rounded-full">
                    {area.severity} Priority
                  </span>
                </div>
                <p className="text-gray-700 text-sm mt-1 ml-6">
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
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Structure</h4>
          <p className="text-gray-700 text-sm">
            {feedback.codeQuality.structure}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800 mb-2">Naming</h4>
          <p className="text-gray-700 text-sm">{feedback.codeQuality.naming}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            Best Practices
          </h4>
          <p className="text-gray-700 text-sm">
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
            className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-gray-900 block">{resource.title}</span>
              <span className="text-gray-500 text-sm">{resource.type}</span>
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

const TechnicalGuide = ({
  openModal,
}: {
  openModal: (title: string, content: string) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">
      Technical Interview Guide
    </h2>
    <div className="space-y-4">
      <Accordion title="Core Topics" icon="📚" initialOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
          {[
            { title: "Arrays" },
            { title: "Linked Lists" },
            { title: "Trees/Graphs" },
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
              className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <h4 className="font-medium text-gray-900 mb-2">
                {topic.title}{" "}
                <FiInfo className="inline-block text-blue-500 ml-1" />
              </h4>
              <p className="text-gray-600 text-sm">
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
              className="p-3 bg-white border border-blue-100 rounded-lg text-sm font-medium text-blue-800 cursor-pointer hover:bg-blue-50"
            >
              {pattern} <FiInfo className="inline-block text-blue-500 ml-1" />
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
              className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="font-semibold text-blue-800">{step.step}</div>
              </div>
              <h4 className="text-gray-900 mb-2">{step.focus}</h4>
              <ul className="grid grid-cols-2 gap-2">
                {step.tasks.map((task) => (
                  <li
                    key={task}
                    className="text-gray-700 text-sm px-3 py-1.5 bg-white rounded-md"
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
              className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-900">{resource.title}</span>
              <FiExternalLink className="text-gray-400" />
            </a>
          ))}
        </div>
      </Accordion>
    </div>
  </div>
);

const BehavioralGuide = ({
  openModal,
}: {
  openModal: (title: string, content: string) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">
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
              className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="font-semibold text-green-800">
                  Q{index + 1}.
                </div>
                <p className="text-gray-900">{question}</p>
                <FiInfo className="text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion title="STAR Method" icon="⭐">
        <div className="grid grid-cols-1 gap-4 p-2">
          <div
            onClick={() => openModal("STAR Method", starMethodExplanation)}
            className="p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-800" />
              <h4 className="font-semibold text-gray-900">STAR</h4>
            </div>
            <p className="text-gray-700 text-sm">
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
            className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <h4 className="font-semibold text-gray-900 mb-2">
              Team Conflict Example
            </h4>
            <p className="text-gray-700">
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
            className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <h4 className="font-semibold text-gray-900 mb-2">
              Handling Failure Example
            </h4>
            <p className="text-gray-700">
              Click to see another STAR-based detailed answer.
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  </div>
);

// ------------------
// Main InterviewPreparation Component
// ------------------

export default function InterviewPreparation() {
  const { data: session, status } = useSession();
  const [error, setError] = useState("");
  const [prepType, setPrepType] = useState<"technical" | "behavioral">(
    "technical"
  );
  const [userQuestion, setUserQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [analysis, setAnalysis] = useState<QuestionAnalysis | null>(null);
  const [feedback, setFeedback] = useState<UserAnswerFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"breakdown" | "feedback">(
    "breakdown"
  );
  const [generatedQuestions, setGeneratedQuestions] =
    useState<InterviewPrepResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalTitle("");
    setModalContent("");
  };

  const handleQuestionAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!session?.user?.id_token) {
      setError("You must be logged in to analyze questions.");
      setLoading(false);
      return;
    }

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const res = await axios.post(
        `${backendUrl}/analyze_question`,
        { question: userQuestion },
        {
          headers: {
            Authorization: `Bearer ${session.user.id_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // The backend returns the analysis object which is nested; we set it directly.
      setAnalysis(res.data);
    } catch (error) {
      console.error("Error analyzing question:", error);
      setError("Failed to analyze question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    setError("");
    setLoading(true);

    if (!session?.user?.id_token) {
      setError("You must be logged in to submit answers.");
      setLoading(false);
      return;
    }

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

      const res = await axios.post(
        `${backendUrl}/feedback`,
        {
          question: analysis?.question,
          user_answer: userAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.id_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFeedback(res.data);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setError("Failed to get feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Please log in to access Interview Preparation.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle}>
        <p className="text-gray-700 whitespace-pre-line">{modalContent}</p>
      </Modal>

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Elevate Interview Preparation
          </h1>
          <p className="text-gray-600 text-lg">
            Technical Excellence Meets Strategic Communication
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => setPrepType("technical")}
            className={`p-6 rounded-xl transition-all ${
              prepType === "technical"
                ? "border-2 border-blue-600 bg-white shadow-lg"
                : "border-2 border-gray-200 hover:border-blue-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  prepType === "technical" ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <FiCode className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900">
                  Technical
                </h3>
                <p className="text-gray-600 text-sm">DSA, System Design</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPrepType("behavioral")}
            className={`p-6 rounded-xl transition-all ${
              prepType === "behavioral"
                ? "border-2 border-green-600 bg-white shadow-lg"
                : "border-2 border-gray-200 hover:border-green-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  prepType === "behavioral" ? "bg-green-600" : "bg-gray-200"
                }`}
              >
                <FiMessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900">
                  Behavioral
                </h3>
                <p className="text-gray-600 text-sm">STAR Method, Examples</p>
              </div>
            </div>
          </button>
        </div>

        {prepType === "technical" ? (
          <TechnicalGuide openModal={openModal} />
        ) : (
          <BehavioralGuide openModal={openModal} />
        )}

        <form
          onSubmit={handleQuestionAnalysis}
          className="bg-white rounded-xl border border-gray-200 p-8 mb-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analyze Coding Question
              </label>
              <textarea
                placeholder="Paste LeetCode/etc question..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-32 text-gray-900 placeholder-gray-400"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin h-5 w-5" />
                  Analyzing...
                </div>
              ) : (
                "Generate Breakdown"
              )}
            </button>
          </div>
        </form>

        {analysis && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("breakdown")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "breakdown"
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Breakdown
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === "feedback"
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Your Solution
                </button>
              </div>
              {activeTab === "feedback" ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      placeholder="Write your solution..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-48 text-gray-900 placeholder-gray-400 font-mono text-sm"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleAnswerSubmit}
                    className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    Get Feedback
                  </button>
                  {feedback && <AnswerFeedback feedback={feedback} />}
                </div>
              ) : (
                <QuestionBreakdown analysis={analysis} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
