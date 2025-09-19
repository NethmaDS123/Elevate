"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleScroll = (id: string) => {
    // Map navbar items to actual section IDs
    const sectionMap: { [key: string]: string } = {
      home: "home",
      features: "features",
      how: "How",
      challenge: "problem",
      solution: "solution",
    };

    const sectionId = sectionMap[id.toLowerCase()] || id;
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 flex justify-center pt-4">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
        >
          <div className="flex items-center justify-between px-6 py-3">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center gap-0 mr-8"
              onClick={() => handleScroll("home")}
            >
              <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
                <span className="text-white font-space font-semibold text-xs">
                  E
                </span>
              </div>
              <span className="text-lg font-space font-medium text-black tracking-tight">
                lvte
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {["Home", "Features", "How", "Challenge", "Solution"].map(
                (item) => (
                  <motion.button
                    key={item}
                    onClick={() => handleScroll(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-600 hover:text-black px-4 py-2 rounded-full
                           transition-all duration-200 hover:bg-gray-100
                           relative group text-sm font-inter font-medium"
                  >
                    {item}
                  </motion.button>
                )
              )}

              <div className="h-4 w-px bg-gray-200 mx-3" />

              <motion.button
                onClick={() => router.push("/signin")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black hover:bg-gray-900 text-white py-2 px-5 rounded-full 
                         font-inter font-medium text-sm transition-all duration-200 
                         shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              >
                Get started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="space-y-1.5">
                <motion.span
                  animate={isOpen ? "open" : "closed"}
                  variants={{
                    open: { rotate: 45, y: 6 },
                    closed: { rotate: 0 },
                  }}
                  className="block w-5 h-[2px] bg-gray-700"
                />
                <motion.span
                  animate={isOpen ? "open" : "closed"}
                  variants={{
                    open: { opacity: 0 },
                    closed: { opacity: 1 },
                  }}
                  className="block w-5 h-[2px] bg-gray-700"
                />
                <motion.span
                  animate={isOpen ? "open" : "closed"}
                  variants={{
                    open: { rotate: -45, y: -6 },
                    closed: { rotate: 0 },
                  }}
                  className="block w-5 h-[2px] bg-gray-700"
                />
              </div>
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed top-0 w-full z-40 flex justify-center pt-20">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-lg border border-gray-200/50 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] mx-4 max-w-sm w-full"
            >
              <div className="p-4">
                {["Home", "Features", "How", "Challenge", "Solution"].map(
                  (item) => (
                    <motion.button
                      key={item}
                      onClick={() => handleScroll(item)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 text-gray-600 hover:text-black hover:bg-gray-100
                             transition-all duration-200 border-b border-gray-100
                             last:border-0 flex items-center justify-between rounded-lg
                             text-sm font-inter font-medium"
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
                    </motion.button>
                  )
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <motion.button
                    onClick={() => router.push("/signin")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-black hover:bg-gray-900 text-white rounded-lg
                             transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                             font-inter font-medium text-sm"
                  >
                    Get started
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
