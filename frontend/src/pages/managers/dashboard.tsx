import React, { useEffect, useState, useMemo } from "react";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  Clock,
  Target,
  Briefcase,
  CheckCircle,
  Eye,
  Edit,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { getAllEngineers } from "@/actions/engineers/engineer-action";
import { getAllProjects } from "@/actions/project/project-actions";
import { getAllAssignments } from "@/actions/assignments/assignment-action";
import { useAuth } from "@/context/authContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, Project, Assignment } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectForm from "./projectForm";
import AssignmentForm from "./assignmentForm";
import { useNavigate } from "react-router-dom";
import UserLogo from "@/features/userLogo";

const ManagerDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [getEngineers, setEngineers] = useState<User[]>([]);
  const [getProjects, setProjects] = useState<Project[]>([]);
  const [getAssignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { token } = useAuth();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch engineers, projects, assignments from API
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      getAllEngineers(token),
      getAllProjects(token),
      getAllAssignments(token),
    ])
      .then(([engData, projData, assignData]) => {
        setEngineers(Array.isArray(engData.engineer) ? engData.engineer : []);
        setProjects(Array.isArray(projData.projects) ? projData.projects : []);
        setAssignments(
          Array.isArray(assignData.assignments) ? assignData.assignments : []
        );
      })
      .catch(() => {
        setEngineers([]);
        setProjects([]);
        setAssignments([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const teamStats = useMemo(() => {
    const overloadedEngineers = (getEngineers ?? []).filter(
      (e) => Number(e.currentCapacity) >= 90
    ).length;

    const availableCapacity = (getEngineers ?? []).reduce(
      (acc, e) =>
        acc + (Number(e.maxCapacity) - Number(e.currentCapacity || 0)),
      0
    );

    const completedTasks = (getAssignments ?? []).filter(
      (a) => a.status?.toLowerCase() === "completed"
    ).length;

    const pendingTasks = (getAssignments ?? []).filter(
      (a) => a.status?.toLowerCase() !== "completed"
    ).length;

    const teamEfficiency =
      getEngineers && getEngineers.length
        ? Math.round(
            getEngineers.reduce(
              (acc, e) => acc + (Number(e.assignments) || 0),
              0
            ) / getEngineers.length
          )
        : 0;

    const avgProjectDelay =
      getProjects && getProjects.length
        ? (
            getProjects.reduce((acc, p) => acc + (Number(p.status) || 0), 0) /
            getProjects.length
          ).toFixed(1)
        : 0;

    return {
      totalEngineers: getEngineers?.length ?? 0,
      activeProjects: (getProjects ?? []).filter((p) => p.status === "active")
        .length,
      overloadedEngineers,
      availableCapacity,
      completedTasks,
      pendingTasks,
      teamEfficiency,
      avgProjectDelay,
    };
  }, [getEngineers, getProjects, getAssignments]);

  const getDaysLeft = (project: Project) => {
    if (!project.startDate || !project.endDate) return "-";
    const now = new Date();
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    if (start > now) return "-"; // Not started yet
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff < 0 ? 0 : diff;
  };

  // Filtering engineers
  const filteredEngineers = useMemo(() => {
    const arr = Array.isArray(getEngineers) ? getEngineers : [];
    return arr.filter((engineer: User) => {
      const matchesSearch =
        engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(engineer.skills) &&
          engineer.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ));
      if (selectedFilter === "all") return matchesSearch;
      if (selectedFilter === "overloaded")
        return matchesSearch && Number(engineer.currentCapacity) >= 90;
      if (selectedFilter === "available")
        return matchesSearch && Number(engineer.currentCapacity) < 70;
      return matchesSearch;
    });
  }, [getEngineers, searchTerm, selectedFilter]);

  // Helper functions
  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return "from-red-500 to-red-600";
    if (capacity >= 70) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };
  const getCapacityStatus = (capacity: number) => {
    if (capacity >= 90) return "Overloaded";
    if (capacity >= 70) return "Busy";
    return "Available";
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // For assignments table, show only first 4 assignments
  const assignmentsToShow = Array.isArray(getAssignments)
    ? getAssignments.slice(0, 4)
    : [];

  // For projects side panel, show only first 4 projects
  const projectsToShow = Array.isArray(getProjects)
    ? getProjects.slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#4b5c9a] via-[#5c66a7] to-[#7d89c4] rounded-3xl p-4 sm:p-8 text-white mb-4 sm:mb-8 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/5 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-40 sm:h-40 bg-white/10 rounded-full translate-y-10 sm:translate-y-20 -translate-x-10 sm:-translate-x-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-10 h-10 sm:w-20 sm:h-20 bg-white/5 rounded-full animate-bounce delay-500"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start xl:items-center justify-between mb-4 sm:mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Engineering Command Center
                </h1>
                <p className="text-blue-100 text-base sm:text-lg">
                  Orchestrate your team's success with precision
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Project Dialog */}
                <Dialog
                  open={projectDialogOpen}
                  onOpenChange={setProjectDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      className="group rounded-[5px] bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 font-medium transition-all duration-300 border border-white/30 flex items-center gap-2 hover:scale-105 transform w-full sm:w-auto"
                      onClick={() => setProjectDialogOpen(true)}
                      type="button"
                    >
                      <Plus
                        size={20}
                        className="group-hover:rotate-90 transition-transform duration-300"
                      />
                      New Project
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white rounded-[15px] w-full max-w-lg sm:max-w-2xl h-auto max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle></DialogTitle>
                      <DialogDescription className="w-full">
                        <ProjectForm setOpen={setProjectDialogOpen} />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* Assignment Dialog */}
                <Dialog
                  open={assignmentDialogOpen}
                  onOpenChange={setAssignmentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button
                      className="group rounded-[5px] bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-3 font-medium transition-all duration-300 border border-white/30 flex items-center gap-2 hover:scale-105 transform w-full sm:w-auto"
                      onClick={() => setAssignmentDialogOpen(true)}
                      type="button"
                    >
                      <Users
                        size={20}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      New Assignment
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white rounded-[15px] w-full max-w-lg sm:max-w-2xl h-auto max-h-[90vh]">
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <div className="group bg-white/15 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {teamStats.totalEngineers}
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">
                      Total Engineers
                    </div>
                  </div>
                </div>
              </div>
              <div className="group bg-white/15 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {teamStats.activeProjects}
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">
                      Active Projects
                    </div>
                  </div>
                </div>
              </div>
              <div className="group bg-white/15 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r rounded-full from-orange-400 to-red-400  flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-orange-200">
                      {teamStats.overloadedEngineers}
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">
                      Overloaded
                    </div>
                  </div>
                </div>
              </div>
              <div className="group bg-white/15 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-6 border border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-green-200">
                      {teamStats.teamEfficiency}%
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">
                      Team Efficiency
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Additional metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-xs sm:text-sm">
                  Completed Tasks: {teamStats.completedTasks}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-4 h-4 text-yellow-300" />
                <span className="text-xs sm:text-sm">
                  Pending Tasks: {teamStats.pendingTasks}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Overview and Projects */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
          {/* Team Overview */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-8">
            {/* Engineer List (scrollable) */}
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-100 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
              <div className="flex flex-col gap-4 xl:flex-row sm:gap-8 sm:justify-between mb-4 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                    Team Overview
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Monitor your engineering team's capacity and performance
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2  sm:gap-4 mt-2 sm:mt-0">
                  <div className="relative flex gap-2 items-center">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search engineers..."
                      className="pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    onValueChange={setSelectedFilter}
                    value={selectedFilter}
                  >
                    <SelectTrigger className="w-full sm:w-auto rounded-[8px] py-3 sm:py-5">
                      <SelectValue placeholder="Select engineer type" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-white rounded-[8px] flex flex-col gap-5">
                      <SelectItem value="all">All Engineers</SelectItem>
                      <SelectItem value="overloaded">Overloaded</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {Array.isArray(filteredEngineers) &&
                filteredEngineers.length > 0 ? (
                  filteredEngineers.map((engineer: User) => (
                    <div
                      key={engineer._id}
                      className="group border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col xl:flex-row sm:gap-6 items-start xl:items-center justify-between gap-4 hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-gradient-to-r from-white to-gray-50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <UserLogo
                            code={engineer.code}
                            color={engineer.color}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                            {engineer.name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {engineer.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                              {engineer.seniority}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                              {engineer.department}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right w-full xl:w-auto">
                        <div className="flex items-center gap-3 mb-2 sm:mb-3">
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-medium text-gray-600">
                              {engineer.currentCapacity}% of{" "}
                              {engineer.maxCapacity}%
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full bg-gradient-to-r ${getCapacityColor(
                              Number(engineer.currentCapacity)
                            )}`}
                          ></div>
                        </div>
                        <div className="w-full xl:w-40 bg-gray-200 rounded-full h-2 sm:h-3 mb-1 sm:mb-2">
                          <div
                            className={`h-2 sm:h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getCapacityColor(
                              Number(engineer.currentCapacity)
                            )}`}
                            style={{
                              width: `${Math.min(
                                100,
                                (Number(engineer.currentCapacity) /
                                  Number(engineer.maxCapacity)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            {getCapacityStatus(
                              Number(engineer.currentCapacity)
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-600">
                            Skills:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(engineer.skills) &&
                              engineer.skills.length > 0 &&
                              engineer.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs px-2 sm:px-3 py-1 rounded-full font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-600">
                              Current Projects:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(engineer.projects)
                                ? engineer.projects.length
                                : 0}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-gray-600">
                              Tasks:{" "}
                              {Array.isArray(engineer.assignments)
                                ? engineer.assignments.length
                                : 0}
                            </span>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 hover:bg-gray-100 rounded-lg">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    {isLoading ? "Loading..." : "No engineers found."}
                  </div>
                )}
              </div>
            </div>
            {/* Assignments Table (show max 4) */}
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-100 mt-4 sm:mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Assignments
                </h2>
                <button
                  className="text-blue-600 hover:underline text-sm mt-2 sm:mt-0"
                  onClick={() => navigate("/assignments")}
                >
                  View More
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Engineer
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Allocation
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed Task
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(assignmentsToShow) &&
                    assignmentsToShow.length > 0 ? (
                      assignmentsToShow.map((assignment) => {
                        // Find engineer/project for display
                        const engineer = getEngineers.find((e: User) =>
                          Array.isArray(assignment.engineerId)
                            ? assignment.engineerId.includes(e._id)
                            : e._id === assignment.engineerId
                        );

                        const project = getProjects.find(
                          (p) => p._id === assignment.projectId
                        );
                        return (
                          <tr
                            key={assignment._id}
                            className="hover:bg-gray-50 "
                          >
                            <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#515caa] rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {engineer && (
                                    <UserLogo
                                      color={engineer.color}
                                      code={engineer.code}
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                                    {engineer?.name}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500">
                                    {engineer?.department}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm font-medium text-gray-900">
                                {project?.name}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {project?.status}
                              </div>
                            </td>
                            <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                              <span className="text-xs sm:text-sm text-gray-900">
                                {assignment.role}
                              </span>
                            </td>
                            <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-medium text-gray-900">
                                  {assignment.allocation}%
                                </span>
                                <div className="w-10 sm:w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 bg-[#515caa] rounded-full"
                                    style={{
                                      width: `${
                                        assignment.allocation >= 100
                                          ? 100
                                          : assignment.allocation
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">
                                {new Date(
                                  assignment.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  assignment.endDate
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                              {assignment &&
                              assignment.status?.toLowerCase() ===
                                "completed" ? (
                                <span className="text-green-600 font-semibold">
                                  ✔ Completed
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                  <Edit className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                  <Trash2 className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center text-gray-400 py-8"
                        >
                          {isLoading ? "Loading..." : "No assignments found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Projects Side Panel */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Active Projects
                </h2>
                <button
                  className="text-blue-600 hover:underline text-sm mt-2 sm:mt-0"
                  onClick={() => navigate("/projects")}
                >
                  View More
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {Array.isArray(projectsToShow) && projectsToShow.length > 0 ? (
                  projectsToShow.map((project) => (
                    <div
                      key={project._id}
                      className="group border border-gray-200 rounded-2xl p-3 sm:p-4 hover:shadow-md transition-all duration-300 hover:border-blue-200"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3">
                        <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                              project.priority
                            )}`}
                          >
                            {project.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mb-2 sm:mb-3">
                        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                          <span>Progress</span>
                          <span className="font-medium">
                            {project.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${project.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Team Size:</span>
                          <span className="font-medium">
                            {project.teamSize} engineers
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Days Left:</span>
                          <span className={`font-medium `}>
                            {getDaysLeft(project)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {(project.requiredSkills || [])
                              .slice(0, 2)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            {project.requiredSkills &&
                              project.requiredSkills.length > 0 &&
                              project.requiredSkills.length > 2 && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                  +{project.requiredSkills.length - 2}
                                </span>
                              )}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    {isLoading ? "Loading..." : "No projects found."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
