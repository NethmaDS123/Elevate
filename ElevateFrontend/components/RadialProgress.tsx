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
  trackColor = "#333333",
  progressColor = "#666666",
  showText = true,
  textClassName = "text-lg font-semibold text-white",
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (value / 100) * circumference;

  // Extract color values from Tailwind classes if they are provided as classes
  const getColorValue = (colorClass: string) => {
    if (colorClass.startsWith("text-")) {
      return `var(--${colorClass.replace("text-", "")})`;
    }
    return colorClass;
  };

  const trackColorValue = getColorValue(trackColor);
  const progressColorValue = getColorValue(progressColor);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full drop-shadow-lg">
        {/* Track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={trackColorValue}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={trackColor.startsWith("text-") ? trackColor : ""}
        />

        {/* Progress */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={progressColorValue}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 1 }}
          strokeDasharray={circumference}
          className={progressColor.startsWith("text-") ? progressColor : ""}
          filter="drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))"
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
