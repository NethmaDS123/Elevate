// components/Hero.tsx (Enhanced)
"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden h-screen flex items-center">
      <div className="absolute inset-0 opacity-5 [background-image:linear-gradient(to_right,#4a556012_1px,transparent_1px),linear-gradient(to_bottom,#4a556012_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container mx-auto relative z-10 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
        >
          Transform Your
          <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Tech Career
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
        >
          Harness AI-powered tools to help guide, develop in-demand skills, and
          accelerate your professional growth in the tech industry.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col md:flex-row gap-6 justify-center"
        >
          <button
            onClick={() => router.push("/signin")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-5 px-16 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
          >
            Start Your Journey
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400"
        >
          <ShieldCheckIcon className="h-5 w-5 text-purple-400" />
          <span>
            Supported by{" "}
            <span className="font-semibold text-gray-300">Ignite Fund</span>{" "}
            innovators
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-6 text-sm text-gray-500 max-w-2xl mx-auto"
        ></motion.div>
      </div>
    </section>
  );
}
