import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Activity,
  TrendingUp,
  Clock,
  Target,
  ChevronDown,
  X,
  Edit,
  Trash2,
  Eye,
  UserIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AssignmentForm from "./assignmentForm";
import { useAuth } from "@/context/authContext";
import { getAllAssignments } from "@/actions/assignments/assignment-action";
import { useNavigate } from "react-router-dom";
import UserLogo from "@/features/userLogo";

const ComprehensiveAssignmentsManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch assignments from API and standardize id
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await getAllAssignments(token);
        // Map _id to id for consistent access
        const assignments = (
          Array.isArray(data.assignments) ? data.assignments : []
        ).map((a: any) => ({
          ...a,
          id: a._id || a.id,
        }));
        setAssignments(assignments);
      } catch (error) {
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [token]);

  // Filtering
  const filteredAssignments = useMemo(() => {
    if (!Array.isArray(assignments) || assignments.length === 0) return [];
    return assignments.filter((assignment) => {
      const matchesSearch =
        assignment?.engineerId[0]?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.project.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.role?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || assignment.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || assignment.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [assignments, searchTerm, filterStatus, filterPriority]);

  // Sorting
  const sortedAssignments = useMemo(() => {
    if (!Array.isArray(filteredAssignments)) return [];
    return [...filteredAssignments].sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "engineerId":
          aValue = a?.engineerId[0]?.name || "";
          bValue = b?.engineerId[0]?.name || "";
          break;
        case "project":
          aValue = a.project.name || "";
          bValue = b.project.name || "";
          break;
        case "allocation":
          aValue = a.allocation || 0;
          bValue = b.allocation || 0;
          break;
        case "startDate":
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case "endDate":
          aValue = new Date(a.endDate);
          bValue = new Date(b.endDate);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredAssignments, sortBy, sortOrder]);

  // Stats
  const assignmentStats = useMemo(
    () => ({
      total: assignments?.length ?? 0,
      active: assignments?.filter((a) => a.status === "active").length ?? 0,
      completed:
        assignments?.filter((a) => a.status === "completed").length ?? 0,
      onHold:
        assignments?.filter(
          (a) => a.status === "on-hold" || a.status === "onHold"
        ).length ?? 0,
    }),
    [assignments]
  );

  // Selection handlers
  const handleSelectAssignment = (assignmentId: string) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignmentId)
        ? prev.filter((id) => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedAssignments(
      selectedAssignments.length === sortedAssignments.length
        ? []
        : sortedAssignments.map((a) => a.id)
    );
  };

  // Badge helpers
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      planned: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      "on-hold": "bg-blue-100 text-blue-800 border-blue-200",
      onHold: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-green-500 text-white",
    };
    return colors[priority] || "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Assignment Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage team assignments, track progress, and optimize resource
                allocation
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Dialog
                open={assignmentDialogOpen}
                onOpenChange={setAssignmentDialogOpen}
              >
                <DialogTrigger asChild>
                  <button className="w-full sm:w-auto bg-[#515caa] hover:bg-[#454a94] text-white px-4 sm:px-6 py-2 rounded-[12px] sm:rounded-[15px] font-medium transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Assignment
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-[15px] w-[98vw] sm:w-[80vw] h-[90%]">
                  <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription className="w-full">
                      <AssignmentForm setOpen={setAssignmentDialogOpen} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assignments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignmentStats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Assignments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignmentStats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignmentStats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Hold</p>
                <p className="text-3xl font-bold text-gray-900">
                  {assignmentStats.onHold}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-[12px] sm:rounded-[20px] shadow-sm border border-gray-200 p-3 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments by engineerId, project, or role..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-[12px] sm:rounded-[15px] focus:ring-2 focus:ring-[#515caa] focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[12px] sm:rounded-[15px] hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* ...filter selects unchanged, just update rounded/padding/text-sm */}
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedAssignments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-[12px] sm:rounded-[15px] p-3 sm:p-4 mb-6">
            {/* ...bulk actions unchanged */}
          </div>
        )}

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : Array.isArray(sortedAssignments) &&
            sortedAssignments.length > 0 ? (
            sortedAssignments.map((assignment) => {
              const isSelected = selectedAssignments.includes(assignment.id);
              console.log(assignment.description);
              return (
                <div
                  onClick={() => navigate(`${assignment._id}`)}
                  key={assignment._id}
                >
                  <div
                    className={`bg-white rounded-[12px] sm:rounded-[20px] shadow-sm border hover:shadow-md transition-all ${
                      isSelected
                        ? "border-[#515caa] ring-2 ring-[#515caa] ring-opacity-20"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="p-4 sm:p-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                        <div className="flex items-start gap-3 sm:gap-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectAssignment(assignment.id);
                            }}
                            className="w-4 h-4 text-[#515caa] rounded border-gray-300 focus:ring-[#515caa]"
                          />
                          <div className="flex flex-col items-start gap-3">
                            {assignment.description}
                            <div className="flex gap-2 items-center">
                              {assignment.engineerId[0].color &&
                              assignment.engineerId[0].code ? (
                                <UserLogo
                                  isSmall={true}
                                  color={assignment.engineerId[0].color}
                                  code={assignment.engineerId[0].code}
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#515caa] rounded-full flex items-center justify-center text-white font-medium">
                                  {assignment?.engineerId[0]?.name[0]}
                                </div>
                              )}

                              <div>
                                <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                                  {assignment?.engineerId[0]?.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {assignment.engineerId.department}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative"></div>
                      </div>
                      {/* Project Info */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                            {assignment?.project?.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                              assignment.priority
                            )}`}
                          >
                            {assignment.priority}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                          {assignment.role}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                            assignment.status
                          )}`}
                        >
                          {assignment.status}
                        </span>
                      </div>
                      {/* Allocation */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <span className="text-xs sm:text-sm text-gray-600">
                            Allocation
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {assignment.allocation ??
                              assignment.allocationPercentage ??
                              0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-[#515caa] rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                assignment.allocation ??
                                  assignment.allocationPercentage ??
                                  0
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      {/* Timeline */}
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                          <span>
                            Start:{" "}
                            {assignment.startDate
                              ? new Date(
                                  assignment.startDate
                                ).toLocaleDateString()
                              : "-"}
                          </span>
                          <span>
                            End:{" "}
                            {assignment.endDate
                              ? new Date(
                                  assignment.endDate
                                ).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-gray-200">
                        <button className="flex-1 bg-[#515caa] hover:bg-[#454a94] text-white py-2 px-2 sm:px-4 rounded-[12px] sm:rounded-[15px] text-xs sm:text-sm font-medium transition-colors">
                          Edit
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-[12px] sm:rounded-[15px] transition-colors">
                          <Trash2 className="w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No assignments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAssignmentsManager;
