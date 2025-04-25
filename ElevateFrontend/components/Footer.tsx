// components/Footer.tsx
"use client";
import { motion } from "framer-motion";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiActivity,
  FiBookOpen,
} from "react-icons/fi";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Elevate
            </h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Bridging the gap between academic knowledge and industry
              requirements through AI-powered career development tools.
            </p>
          </motion.div>

          {/* Resources Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-gray-300 uppercase mb-2">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2"
                >
                  <FiBookOpen className="w-4 h-4" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/github"
                  className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2"
                >
                  <FiGithub className="w-4 h-4" />
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2"
                >
                  <FiActivity className="w-4 h-4" />
                  System Status
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Connect Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-gray-300 uppercase mb-2">
              Connect
            </h4>
            <div className="flex gap-4">
              <Link
                href="https://twitter.com"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiTwitter className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiLinkedin className="w-5 h-5" />
              </Link>
              <Link
                href="https://github.com"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiGithub className="w-5 h-5" />
              </Link>
            </div>

            <div className="mt-4">
              <Link
                href="mailto:support@elevate.com"
                className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2"
              >
                <FiMail className="w-4 h-4" />
                support@elevate.com
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8" />

        {/* Bottom Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Elevate. Empowering tech careers
            worldwide.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm transition"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm transition"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>

        {/* Funding Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-600">
            Supported by the{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ignite Fund
            </span>{" "}
            for educational technology
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
