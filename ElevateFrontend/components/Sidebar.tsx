"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <motion.aside
      className="bg-gray-900 text-white fixed h-screen p-4 border-r border-gray-700 z-50 shadow-xl"
      animate={{ width: isOpen ? "240px" : "80px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/"
        className="flex items-center gap-3 mb-8 overflow-hidden group p-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : 360 }}
          className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex-shrink-0 flex items-center justify-center"
        >
          <FiArrowUpRight className="text-white w-4 h-4" />
        </motion.div>
        <motion.span
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Elevate
        </motion.span>
      </Link>

      <nav className="space-y-1">
        <SidebarLink
          href="/platform/features/dashboard"
          icon={<FiHome />}
          label="Dashboard"
          isOpen={isOpen}
          isActive={pathname === "/platform/features/dashboard"}
        />
        <SidebarLink
          href="/platform/features/resume-optimizer"
          icon={<FiFileText />}
          label="Resume Optimizer"
          isOpen={isOpen}
          isActive={pathname === "/platform/features/resume-optimizer"}
        />
        <SidebarLink
          href="/platform/features/project-evaluation"
          icon={<FiClipboard />}
          label="Project Evaluation"
          isOpen={isOpen}
          isActive={pathname === "/platform/features/project-evaluation"}
        />
        <SidebarLink
          href="/platform/features/interview-prep"
          icon={<FiCheckCircle />}
          label="Interview Prep"
          isOpen={isOpen}
          isActive={pathname === "/platform/features/interview-prep"}
        />
        <SidebarLink
          href="/platform/features/learning-paths"
          icon={<FiBookOpen />}
          label="Learning Pathways"
          isOpen={isOpen}
          isActive={pathname === "/platform/features/learning-paths"}
        />
        <SidebarLink
          href="/platform/features/skill-gap-analysis"
          icon={<FiUsers />}
          label="Skill Gap Analysis"
          isOpen={isOpen}
          isActive={pathname === "/platform/features/skill-gap-analysis"}
        />
        <SidebarLink
          href="/platform/features/role-transition"
          icon={<FiArrowUpRight />}
          label="Role Transition"
          isOpen={isOpen}
          isActive={pathname === "/platform/features/role-transition"}
        />

        <div className="pt-4 mt-4 border-t border-gray-700">
          <motion.button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            whileHover={{ x: 5 }}
            className="flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-lg transition-colors group w-full text-red-400 hover:text-red-300"
          >
            <FiArrowLeft className="w-5 h-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="whitespace-nowrap text-sm"
            >
              Logout
            </motion.span>
          </motion.button>
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
  isActive,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative group ${
        isActive
          ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400"
          : "hover:bg-gray-800 text-gray-400 hover:text-white"
      }`}
    >
      <motion.span
        animate={{ color: isActive ? "#818CF8" : "#9CA3AF" }}
        className="flex-shrink-0"
      >
        {icon}
      </motion.span>
      <motion.span
        animate={{ opacity: isOpen ? 1 : 0 }}
        className="whitespace-nowrap text-sm font-medium"
      >
        {label}
      </motion.span>

      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-2 px-3 py-2 bg-gray-800 rounded-lg shadow-lg text-sm font-medium hidden group-hover:block"
        >
          {label}
        </motion.div>
      )}
    </Link>
  );
}
