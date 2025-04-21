"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  FiHome,
  FiFileText,
  FiClipboard,
  FiBookOpen,
  FiUser,
  FiArrowLeft,
  FiCheckCircle,
  FiArrowUpRight,
  FiUsers,
} from "react-icons/fi";
import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <motion.aside
      className="bg-gray-900 text-white fixed h-screen p-4 border-r border-gray-700 z-50"
      animate={{ width: isOpen ? "240px" : "72px" }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/"
        className="flex items-center gap-3 mb-8 overflow-hidden group"
      >
        <div className="w-8 h-8 bg-blue-400 rounded-lg flex-shrink-0 transition-transform group-hover:scale-110" />
        <motion.span
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="text-xl font-bold text-blue-400 whitespace-nowrap transition-colors group-hover:text-blue-300"
        >
          Elevate
        </motion.span>
      </Link>

      <nav className="space-y-1">
        <SidebarLink
          href="/platform/features/dashboard"
          icon={<FiHome className="w-5 h-5" />}
          label="Dashboard"
          isOpen={isOpen}
        />
        <SidebarLink
          href="/platform/features/resume-optimizer"
          icon={<FiFileText className="w-5 h-5" />}
          label="Resume Optimizer"
          isOpen={isOpen}
        />
        <SidebarLink
          href="/platform/features/project-evaluation"
          icon={<FiClipboard className="w-5 h-5" />}
          label="Project Evaluation"
          isOpen={isOpen}
        />
        <SidebarLink
          href="/platform/features/interview-prep"
          icon={<FiCheckCircle className="w-5 h-5" />}
          label="Interview Prep"
          isOpen={isOpen}
        />
        <SidebarLink
          href="/platform/features/learning-paths"
          icon={<FiBookOpen className="w-5 h-5" />}
          label="Learning Pathways"
          isOpen={isOpen}
        />
        <SidebarLink
          href="/platform/features/skill-gap-analysis"
          icon={<FiUsers className="w-5 h-5" />}
          label="Skill Gap Analysis"
          isOpen={isOpen}
        />
        <SidebarLink
          href="/platform/features/role-transition"
          icon={<FiArrowUpRight className="w-5 h-5" />}
          label="Role Transition"
          isOpen={isOpen}
        />

        <SidebarLink
          href="/platform/profile"
          icon={<FiUser className="w-5 h-5" />}
          label="Profile"
          isOpen={isOpen}
        />

        <div className="pt-4 mt-4 border-t border-gray-700">
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group w-full text-left"
          >
            <FiArrowLeft className="w-5 h-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="whitespace-nowrap text-sm transition-opacity"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  isOpen,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg transition-colors group"
    >
      <span className="flex-shrink-0">{icon}</span>
      <motion.span
        animate={{ opacity: isOpen ? 1 : 0 }}
        className="whitespace-nowrap text-sm transition-opacity"
      >
        {label}
      </motion.span>
    </Link>
  );
}
