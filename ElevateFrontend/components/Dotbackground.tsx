"use client";
import React from "react";

export function DotBackgroundDemo() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black dark:bg-dot-white/[0.1] bg-dot-black/[0.1] pointer-events-none">
      {/* Optional radial gradient for smoother look */}
      <div className="absolute inset-0 [mask-image:radial-gradient(circle, transparent 20%, black)]"></div>
    </div>
  );
}
