"use client"; // Ensures client-side rendering
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // For animations

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false); // Close mobile menu after clicking a link
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo with Hover Effect */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-2xl font-extrabold text-black cursor-pointer"
          onClick={() => handleScroll("hero")}
          aria-label="Go to Home"
        >
          <span className="text-blue-500">Elevate</span>
        </motion.div>

        {/* Links for Desktop */}
        <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <button
            onClick={() => handleScroll("hero")}
            className="hover:text-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Home
          </button>
          <button
            onClick={() => handleScroll("features")}
            className="hover:text-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Features
          </button>
          <button
            onClick={() => handleScroll("how-it-works")}
            className="hover:text-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            How It Works
          </button>
          <button
            onClick={() => handleScroll("benefits")}
            className="hover:text-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Benefits
          </button>
        </div>

        {/* Call-to-Action Buttons for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => router.push("/signin")}
            className="text-gray-600 hover:text-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span className="material-icons">{isOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg text-center py-4"
          >
            <button
              onClick={() => handleScroll("hero")}
              className="block py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              Home
            </button>
            <button
              onClick={() => handleScroll("features")}
              className="block py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              Features
            </button>
            <button
              onClick={() => handleScroll("how-it-works")}
              className="block py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScroll("benefits")}
              className="block py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              Benefits
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/signin");
              }}
              className="block py-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/signup");
              }}
              className="block py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full mx-auto max-w-xs"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
