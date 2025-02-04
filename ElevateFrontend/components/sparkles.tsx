"use client";
import dynamic from "next/dynamic";

const SparklesCore = dynamic(
  () => import("../components/SparklesCore").then((mod) => mod.SparklesCore),
  { ssr: false }
);

export { SparklesCore };
