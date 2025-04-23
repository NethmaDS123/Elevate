"use client";
import { motion } from "framer-motion";

interface RadialProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  showText?: boolean;
  textClassName?: string;
}

export function RadialProgress({
  value = 0,
  size = 120,
  strokeWidth = 8,
  trackColor = "#e5e7eb",
  progressColor = "#3b82f6",
  showText = true,
  textClassName = "text-lg font-semibold",
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 1 }}
          strokeDasharray={circumference}
        />
      </svg>

      {/* Center Text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={textClassName}>{Math.round(value)}%</span>
        </div>
      )}
    </div>
  );
}
