"use client"; // Ensures client-side rendering
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // For animations

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative bg-gradient-to-br from-white via-gray-100 to-gray-50 text-black overflow-hidden h-[90vh] flex items-center">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 bg-[url('/assets/hero-bg-pattern.svg')] bg-no-repeat bg-center bg-cover opacity-10 animate-moveBackground"
        aria-hidden="true"
      ></div>

      {/* Blurred Decorative Elements */}
      <div
        className="absolute -top-16 -left-16 w-96 h-96 bg-blue-500 blur-[120px] opacity-20 z-0 animate-float"
        aria-hidden="true"
      ></div>
      <div
        className="absolute -bottom-16 -right-16 w-96 h-96 bg-purple-500 blur-[120px] opacity-20 z-0 animate-floatDelay"
        aria-hidden="true"
      ></div>

      {/* Content Container */}
      <div className="container mx-auto relative z-10 px-6 text-center">
        {/* Headline with Animation */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-5xl font-extrabold leading-tight tracking-tighter"
        >
          Unlock your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Career Potential
          </span>
        </motion.h1>

        {/* Subtitle with Animation */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto"
        >
          Empower your career with cutting-edge tools, flexible pathways, and
          tailored guidance designed to help you succeed.
        </motion.p>

        {/* Call-to-Action Buttons with Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col md:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push("/signin")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-14 rounded-full text-lg font-semibold shadow-lg transition-all hover:scale-105 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            Get Started for Free
          </button>
        </motion.div>
      </div>
    </section>
  );
}
