"use client";

import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Navbar from "@/components/Navbar";
import HowItWorks from "./components/HowitWorks";
import AboutUs from "./components/AboutUs";

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
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="about-us">
        <AboutUs />
      </div>
    </div>
  );
}
