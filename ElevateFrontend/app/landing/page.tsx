"use client";

import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
    </div>
  );
}
