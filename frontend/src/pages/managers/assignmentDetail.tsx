import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Clock,
  Calendar,
  User,
  TrendingUp,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleAssignment,
  updateAssignment,
  deleteAssignment,
} from "@/actions/assignments/assignment-action";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AssignmentForm from "./assignmentForm";

const getPriorityBadge = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "in progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "on hold":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "not started":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch assignment by ID
  const fetchAssignment = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getSingleAssignment(id, token!);
      setAssignment(data.assignment);
    } catch {
      toast.error("Failed to fetch assignment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignment();
    // eslint-disable-next-line
  }, [id]);

  const handleEdit = async (values: any) => {
    setEditLoading(true);
    if (!id) return;
    try {
      const result = await updateAssignment(id, values, token!);
      if (result.success) {
        toast.success("Assignment updated.");
        setEditDialogOpen(false);
        fetchAssignment();
      } else {
        toast.error("Failed to update assignment.");
      }
    } catch {
      toast.error("Failed to update assignment.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!id) return;
      const result = await deleteAssignment(id, token!);
      if (result.success) {
        toast.success("Assignment deleted.");
        navigate(-1);
      } else {
        toast.error("Failed to delete assignment.");
      }
    } catch {
      toast.error("Failed to delete assignment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }
  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Assignment not found.
      </div>
    );
  }

  // If you use .populate(), engineerId is an array of engineer objects
  const engineer =
    Array.isArray(assignment.engineerId) && assignment.engineerId.length > 0
      ? assignment.engineerId[0]
      : assignment.engineer || {};

  const project =
    typeof assignment.projectId === "object" && assignment.projectId !== null
      ? assignment.projectId
      : assignment.project || {};

  const milestones = assignment.milestones || [];
  const timeEntries = assignment.timeEntries || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-[15px] transition-colors"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Assignment Details
                </h1>
                <p className="text-sm text-gray-500">
                  Manage assignment information and progress
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Edit and Delete buttons at the top right */}
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <button className="p-2 hover:bg-blue-50 rounded-[15px] transition-colors">
                    <Edit className="w-5 h-5 text-blue-600" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-[15px] w-[90vw] max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Assignment</DialogTitle>
                    <DialogDescription>
                      Update assignment details below.
                    </DialogDescription>
                  </DialogHeader>
                  <AssignmentForm editId={id} setOpen={setEditDialogOpen} />
                </DialogContent>
              </Dialog>
              <button
                className="p-2 hover:bg-red-50 rounded-[15px] transition-colors"
                onClick={handleDelete}
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-[15px] transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 grid-flow-row gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assignment Overview */}
            <div className="bg-white rounded-[20px] shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Assignment Overview
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                      assignment.priority
                    )}`}
                  >
                    {assignment.priority} Priority
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                      assignment.status
                    )}`}
                  >
                    {assignment.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium text-gray-900">
                        {assignment.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">
                        {assignment.startDate
                          ? new Date(assignment.startDate).toLocaleDateString()
                          : "-"}{" "}
                        -{" "}
                        {assignment.endDate
                          ? new Date(assignment.endDate).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Allocation</p>
                      <p className="font-medium text-gray-900">
                        {assignment.allocation ??
                          assignment.allocationPercentage ??
                          0}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Hours</p>
                      <p className="font-medium text-gray-900">
                        {assignment.billableHours || 0} /{" "}
                        {assignment.totalHours || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Allocation Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Allocation Progress
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {assignment.allocation ??
                      assignment.allocationPercentage ??
                      0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 bg-[#515caa] rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        assignment.allocation ??
                        assignment.allocationPercentage ??
                        0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Hours Progress */}
              {assignment.billableHours && assignment.totalHours && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Hours Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(
                        (assignment.billableHours / assignment.totalHours) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 bg-green-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (assignment.billableHours / assignment.totalHours) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notes (Description) */}
            {assignment.description && (
              <div className="bg-white rounded-[20px] shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                </div>
                <div className="bg-gray-50 rounded-[15px] p-4">
                  <p className="text-gray-700">{assignment.description}</p>
                </div>
              </div>
            )}

            {/* Milestones */}
            {Array.isArray(milestones) && milestones.length > 0 && (
              <div className="bg-white rounded-[20px] shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Milestones
                </h3>
                <div className="space-y-3">
                  {milestones.map((milestone: any) => (
                    <div
                      key={milestone.id || milestone._id}
                      className="flex items-center gap-3 p-3 rounded-[15px] hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.completed ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        {milestone.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            milestone.completed
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {milestone.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due:{" "}
                          {milestone.date
                            ? new Date(milestone.date).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: 2 columns on desktop, stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engineer Info */}
            <div className="bg-white rounded-[20px] shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Assigned Engineer
              </h3>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-[#515caa] rounded-full flex items-center justify-center text-white font-medium text-xl mx-auto mb-3">
                  {engineer.avatar || engineer.name?.[0] || "E"}
                </div>
                <h4 className="font-medium text-gray-900">{engineer.name}</h4>
                <p className="text-sm text-gray-600">{engineer.department}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{engineer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(engineer.skills || []).map(
                      (skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-[20px] shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Project Name</p>
                  <p className="font-medium text-gray-900">{project.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium text-gray-900">{project.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Project Manager</p>
                  <p className="font-medium text-gray-900">{project.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium text-gray-900">{project.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-700">{project.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
