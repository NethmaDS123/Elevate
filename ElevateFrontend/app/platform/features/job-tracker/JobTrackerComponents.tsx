"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiExternalLink,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiMail,
  FiClock,
  FiX,
  FiLoader,
  FiAlertCircle,
  FiBriefcase,
  FiFilter,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import { useSidebar } from "@/components/SidebarContext";
import {
  JobApplication,
  JOB_STATUSES,
  WORK_TYPES,
  PRIORITIES,
} from "./JobTrackerLogic";

interface JobTrackerUIProps {
  applications: JobApplication[];
  onCreateApplication: (
    data: Omit<JobApplication, "id" | "applicationDate" | "lastUpdateDate">
  ) => Promise<JobApplication | null>;
  onUpdateApplication: (
    id: string,
    updates: Partial<JobApplication>
  ) => Promise<JobApplication | null>;
  onDeleteApplication: (id: string) => Promise<boolean>;
  onMoveApplication: (
    id: string,
    newStatus: JobApplication["status"]
  ) => Promise<JobApplication | null>;
}

export function JobTrackerUI({
  applications,
  onCreateApplication,
  onUpdateApplication,
  onDeleteApplication,
}: JobTrackerUIProps) {
  const { isOpen } = useSidebar();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof JobApplication>("applicationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort applications
  const filteredAndSortedApplications = React.useMemo(() => {
    let filtered = applications.filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortBy] || "";
      const bValue = b[sortBy] || "";

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [applications, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (column: keyof JobApplication) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#0F0F0F] transition-all duration-300 ${
        isOpen ? "ml-60" : "ml-20"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#252525] rounded-xl text-[#8B5CF6]">
              <FiBriefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📊</span> Job Database
              </h1>
              <p className="text-gray-400">
                Track your job applications in a spreadsheet view
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2E7EF0] text-white rounded-lg hover:bg-[#1D6FDC] transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            New
            <FiChevronDown className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#252525] rounded-lg border border-[#2A2A2A]">
            <FiSearch className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white text-sm focus:outline-none focus:border-[#8B5CF6]"
          >
            <option value="all">All Status</option>
            {JOB_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FiFilter className="w-4 h-4" />
            <span>{filteredAndSortedApplications.length} results</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="bg-[#161616] rounded-xl border border-[#2A2A2A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span></span>
                      <button
                        onClick={() => handleSort("company")}
                        className="hover:text-white transition-colors"
                      >
                        Company Name
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span></span>
                      <button
                        onClick={() => handleSort("position")}
                        className="hover:text-white transition-colors"
                      >
                        Position
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span></span>
                      <button
                        onClick={() => handleSort("status")}
                        className="hover:text-white transition-colors"
                      >
                        Status
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span></span>
                      Job Post
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span></span>
                      <button
                        onClick={() => handleSort("applicationDate")}
                        className="hover:text-white transition-colors"
                      >
                        Date
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <span></span>
                      Notes
                    </div>
                  </th>
                  <th className="text-left p-4 text-gray-400 font-medium text-sm w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedApplications.map((application, index) => (
                  <TableRow
                    key={application.id}
                    application={application}
                    isEven={index % 2 === 0}
                    onEdit={() => setEditingApplication(application)}
                    onDelete={() => onDeleteApplication(application.id)}
                    onUpdateStatus={(status) =>
                      onUpdateApplication(application.id, { status })
                    }
                  />
                ))}
                {filteredAndSortedApplications.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      {searchTerm || statusFilter !== "all"
                        ? "No applications match your filters"
                        : "No applications yet. Click 'New' to add your first application."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Application Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <ApplicationModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={onCreateApplication}
            title="Add New Application"
          />
        )}
      </AnimatePresence>

      {/* Edit Application Modal */}
      <AnimatePresence>
        {editingApplication && (
          <ApplicationModal
            isOpen={!!editingApplication}
            onClose={() => setEditingApplication(null)}
            onSubmit={(data) =>
              onUpdateApplication(editingApplication.id, data)
            }
            title="Edit Application"
            initialData={editingApplication}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TableRow({
  application,
  isEven,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  application: JobApplication;
  isEven: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (status: JobApplication["status"]) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const status = JOB_STATUSES.find((s) => s.id === application.status);
  const workType = WORK_TYPES.find((w) => w.id === application.workType);
  const priority = PRIORITIES.find((p) => p.id === application.priority);

  const getStatusColor = (status: string) => {
    const statusConfig = JOB_STATUSES.find((s) => s.id === status);
    return statusConfig?.color || "bg-gray-500";
  };

  return (
    <>
      <motion.tr
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`border-b border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors group ${
          isEven ? "bg-[#161616]" : "bg-[#151515]"
        }`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Company */}
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#252525] rounded-lg flex items-center justify-center text-sm">
              📁
            </div>
            <div>
              <div className="text-white font-medium">
                {application.company}
              </div>
              <div className="text-gray-400 text-sm flex items-center gap-2">
                <FiMapPin className="w-3 h-3" />
                {application.location}
                <span className="text-gray-600">•</span>
                <span className={priority?.color}>
                  {priority?.label} Priority
                </span>
                <span className="text-gray-600">•</span>
                <span>{workType?.label}</span>
                {application.salary && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span>{application.salary}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Position */}
        <td className="p-4">
          <div className="text-white font-medium">{application.position}</div>
          <div className="text-gray-400 text-sm">
            Applied {new Date(application.applicationDate).toLocaleDateString()}
          </div>
        </td>

        {/* Status */}
        <td className="p-4">
          <select
            value={application.status}
            onChange={(e) =>
              onUpdateStatus(e.target.value as JobApplication["status"])
            }
            className={`px-3 py-1 rounded-full text-white text-sm border-none outline-none cursor-pointer ${getStatusColor(
              application.status
            )}`}
          >
            {JOB_STATUSES.map((status) => (
              <option
                key={status.id}
                value={status.id}
                className="bg-[#252525] text-white"
              >
                {status.label}
              </option>
            ))}
          </select>
        </td>

        {/* Job Post */}
        <td className="p-4">
          {application.jobUrl ? (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2E7EF0] hover:text-[#1D6FDC] transition-colors flex items-center gap-1 text-sm"
            >
              {application.jobUrl.includes("linkedin")
                ? "linkedin.com"
                : application.jobUrl.includes("greenhouse")
                ? "boards.greenhouse.io"
                : application.jobUrl.includes("lever")
                ? "jobs.lever.co"
                : new URL(application.jobUrl).hostname}
              <FiExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </td>

        {/* Date */}
        <td className="p-4 text-gray-300">
          {new Date(application.applicationDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </td>

        {/* Notes */}
        <td className="p-4">
          {application.notes ? (
            <div className="text-gray-300 text-sm line-clamp-2 max-w-xs">
              {application.notes}
            </div>
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </td>

        {/* Actions */}
        <td className="p-4">
          <div
            className={`flex items-center gap-1 transition-opacity ${
              showActions ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Toggle details"
            >
              <FiChevronDown
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Edit"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </motion.tr>

      {/* Expanded Details Row */}
      <AnimatePresence>
        {isExpanded && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[#2A2A2A] bg-[#1A1A1A]"
          >
            <td colSpan={7} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {application.contactPerson && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Contact:</span>
                    <span>{application.contactPerson}</span>
                  </div>
                )}
                {application.contactEmail && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Email:</span>
                    <span>{application.contactEmail}</span>
                  </div>
                )}
                {application.nextStepDate && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Next Step:</span>
                    <span>
                      {new Date(application.nextStepDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              {application.notes && (
                <div className="mt-3 p-3 bg-[#252525] rounded-lg">
                  <div className="text-gray-400 text-xs mb-1">Notes:</div>
                  <div className="text-gray-300 text-sm">
                    {application.notes}
                  </div>
                </div>
              )}
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
  title: string;
  initialData?: JobApplication;
}) {
  const [formData, setFormData] = useState({
    company: initialData?.company || "",
    position: initialData?.position || "",
    location: initialData?.location || "",
    workType: initialData?.workType || "remote",
    salary: initialData?.salary || "",
    status: initialData?.status || "applied",
    notes: initialData?.notes || "",
    jobUrl: initialData?.jobUrl || "",
    contactPerson: initialData?.contactPerson || "",
    contactEmail: initialData?.contactEmail || "",
    nextStepDate: initialData?.nextStepDate || "",
    priority: initialData?.priority || "medium",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#161616] rounded-xl border border-[#2A2A2A] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]"
                placeholder="Company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]"
                placeholder="Job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Work Type
              </label>
              <select
                value={formData.workType}
                onChange={(e) =>
                  setFormData({ ...formData, workType: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                {WORK_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]"
                placeholder="e.g., $80k - $100k"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
              >
                {JOB_STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Next Step Date
              </label>
              <input
                type="date"
                value={formData.nextStepDate}
                onChange={(e) =>
                  setFormData({ ...formData, nextStepDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job URL
              </label>
              <input
                type="url"
                value={formData.jobUrl}
                onChange={(e) =>
                  setFormData({ ...formData, jobUrl: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]"
                placeholder="Recruiter or hiring manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6]"
                placeholder="contact@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 bg-[#252525] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#8B5CF6] resize-none"
              placeholder="Application notes, interview feedback, etc."
            />
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 pt-4 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#252525] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-[#2E7EF0] text-white rounded-lg hover:bg-[#1D6FDC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Application"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#252525] rounded-xl mb-4">
          <FiLoader className="w-8 h-8 text-[#8B5CF6] animate-spin" />
        </div>
        <p className="text-gray-400">Loading your job applications...</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#252525] rounded-xl mb-4">
          <FiAlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <p className="text-red-400 mb-2">Error loading applications</p>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
}
