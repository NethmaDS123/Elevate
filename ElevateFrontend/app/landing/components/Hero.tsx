"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative bg-white text-gray-900 overflow-hidden min-h-screen flex items-center">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto relative z-10 px-6 max-w-6xl">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center">
          {/* Left Column - Content */}
          <div className="lg:text-left text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-150 mb-8">
                <SparklesIcon className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-mono font-medium text-gray-600 tracking-wide uppercase">
                  AI-POWERED PLATFORM
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center gap-0 mb-8 lg:justify-start justify-center"
            >
              <div className="w-6 h-6 relative">
                <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
                  <span className="text-white font-space font-semibold text-xs">
                    E
                  </span>
                </div>
              </div>
              <div className="text-lg font-space font-medium text-black tracking-tight">
                lvte
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <span className="block text-3xl md:text-4xl lg:text-5xl font-space font-bold leading-[1.1] text-black mb-1">
                Transform your
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-serif font-normal leading-[1.2] text-gray-700 italic">
                tech career trajectory
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10 space-y-3"
            >
              <p className="text-base font-inter text-gray-600 max-w-md lg:mx-0 mx-auto leading-relaxed font-normal">
                AI-powered tools that analyze, optimize, and accelerate your
                professional growth.
              </p>
              <p className="text-sm font-mono text-gray-500 max-w-md lg:mx-0 mx-auto leading-relaxed uppercase tracking-wider">
                Built for ambitious developers who code the future
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 lg:justify-start justify-center mb-10"
            >
              <button
                onClick={() => router.push("/signin")}
                className="group bg-black hover:bg-gray-900 text-white py-2.5 px-5 rounded font-inter font-medium text-sm transition-all duration-200 flex items-center gap-2 justify-center"
              >
                Get started
                <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center lg:justify-start justify-center gap-2"
            >
              <ShieldCheckIcon className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-mono text-gray-500 font-normal tracking-wide">
                Funded by the Ignite Fund
              </span>
            </motion.div>
          </div>

          {/* Right Column - Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:block hidden"
          >
            {/* Dashboard Preview Card */}
            <div className="bg-white rounded-lg p-5 border border-gray-150 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-5 relative">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-500 text-xs font-mono ml-2 tracking-wide uppercase">
                  Dashboard.tsx
                </span>
              </div>

              {/* Mock dashboard content */}
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                      <SparklesIcon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-900 font-space font-medium text-sm">
                        Resume Score
                      </div>
                      <div className="text-gray-500 text-xs font-mono">
                        ATS_OPTIMIZED
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-space font-bold text-black">
                    92%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="text-gray-500 text-xs mb-1 font-mono uppercase tracking-wide">
                      Applications
                    </div>
                    <div className="text-gray-900 font-space font-bold text-lg">
                      24
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="text-gray-500 text-xs mb-1 font-mono uppercase tracking-wide">
                      Interviews
                    </div>
                    <div className="text-gray-900 font-space font-bold text-lg">
                      8
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded border border-gray-100">
                  <div className="text-gray-900 font-space font-medium mb-2 text-sm">
                    Skills Progress
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs font-mono">
                        Machine Learning
                      </span>
                      <span className="text-gray-900 text-xs font-mono font-medium">
                        85%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-black h-1.5 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simplified floating elements */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-3 -right-3 bg-gray-100 p-2.5 rounded-lg shadow-sm border border-gray-200"
            >
              <SparklesIcon className="h-4 w-4 text-gray-600" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              className="absolute -bottom-3 -left-3 bg-gray-100 p-2.5 rounded-lg shadow-sm border border-gray-200"
            >
              <ShieldCheckIcon className="h-4 w-4 text-gray-600" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
