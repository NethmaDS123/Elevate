"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo with Gradient */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-extrabold cursor-pointer"
          onClick={() => handleScroll("hero")}
        >
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Elevate
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex space-x-6">
            {["Home", "Features", "Steps", "Problem", "Solution"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => handleScroll(item.toLowerCase())}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg
                         transition-all duration-300 hover:bg-gray-800/50
                         relative group"
                >
                  {item}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-400 
                               transition-all duration-300 group-hover:w-full"
                  />
                </button>
              )
            )}
          </div>

          <div className="h-6 w-px bg-gray-700 mx-4" />

          <button
            onClick={() => router.push("/platform/features/dashboard")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 
                     text-white py-2 px-6 rounded-lg font-semibold shadow-lg
                     transition-all duration-300 hover:shadow-purple-500/20
                     flex items-center gap-2"
          >
            <span>Get Started</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <div className="space-y-1.5">
            <motion.span
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 45, y: 6 },
                closed: { rotate: 0 },
              }}
              className="block w-6 h-[2px] bg-gray-300"
            />
            <motion.span
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: { opacity: 0 },
                closed: { opacity: 1 },
              }}
              className="block w-6 h-[2px] bg-gray-300"
            />
            <motion.span
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: { rotate: -45, y: -6 },
                closed: { rotate: 0 },
              }}
              className="block w-6 h-[2px] bg-gray-300"
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-b border-gray-800"
          >
            <div className="container mx-auto px-6 py-4">
              {["Home", "Features", "Steps", "The Problem", "The Solution"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() =>
                      handleScroll(item.toLowerCase().replace(" ", "-"))
                    }
                    className="w-full py-4 text-gray-300 hover:text-white 
                           transition-colors duration-300 border-b border-gray-800
                           last:border-0 flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )
              )}

              <div className="mt-6 space-y-4">
                <button
                  onClick={() => router.push("/signin")}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 
                           hover:from-purple-600 hover:to-blue-600 text-white rounded-lg
                           transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
