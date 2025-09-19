// components/Footer.tsx
"use client";
import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.01] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:120px_120px]" />

      <div className="max-w-6xl mx-auto py-12 px-6 relative z-10">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded bg-black flex items-center justify-center">
              <span className="text-white font-space font-semibold text-xs">
                E
              </span>
            </div>
            <div className="text-lg font-space font-medium text-black tracking-tight">
              Elevate
            </div>
          </div>
          <p className="text-sm font-inter text-gray-600 max-w-md mx-auto leading-relaxed">
            AI-powered career development tools for ambitious developers
          </p>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-6" />

        {/* Bottom Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs font-mono text-gray-500 text-center uppercase tracking-wide">
            © {new Date().getFullYear()} ELEVATE. BUILT FOR DEVELOPERS.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wide">
              Privacy
            </span>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-wide">
              Terms
            </span>
          </div>
        </motion.div>

        {/* Funding Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-md border border-gray-150">
            <FiZap className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-mono text-gray-600 tracking-wide uppercase">
              Funded by the Ignite Fund
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
