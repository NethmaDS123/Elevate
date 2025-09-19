"use client";

import Hero from "./components/Hero";
import Features from "./components/Features";
import Navbar from "@/components/Navbar";
import HowItWorks from "./components/HowitWorks";
import SolutionSection from "./components/SolutionSection";
import TheProblem from "./components/TheProblem";

export default function LandingPage() {
  return (
    <div className="bg-[#1A1A1A] min-h-screen">
      <Navbar />
      <div id="home">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="How">
        <HowItWorks />
      </div>
      <div id="problem">
        <TheProblem />
      </div>
      <div id="solution">
        <SolutionSection />
      </div>
    </div>
  );
}
