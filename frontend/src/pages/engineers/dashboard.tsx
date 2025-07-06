import { useState, useEffect } from "react";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FolderOpen,
  PlayCircle,
  Target,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { getAllAssignments } from "@/actions/assignments/assignment-action";
import { getAllProjects } from "@/actions/project/project-actions";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/formatData";

const EngineerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const getStatusIcon = (status: any) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "active":
      case "on-hold":
        return <PlayCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };
  // Fetch assignments and projects for this engineer
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) return;
      setLoading(true);
      try {
        const [assignmentsRes, projectsRes] = await Promise.all([
          getAllAssignments(token),
          getAllProjects(token),
        ]);
        setAssignments(assignmentsRes.assignments || []);
        setProjects(projectsRes.projects || []);
      } catch (e) {
        setAssignments([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token]);
  const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "active":
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "on-hold":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get priority color helper
  const getPriorityColor = (priority: any) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  // Calculate stats
  const activeProjects = projects.filter(
    (p: any) => p.status?.toLowerCase() === "active"
  );
  const pendingTasks = assignments.filter(
    (a: any) => a.status?.toLowerCase() !== "completed"
  );
  const completedTasks = assignments.filter(
    (a: any) => a.status?.toLowerCase() === "completed"
  );

  // Current capacity (assume user.currentCapacity is a string or number)
  const currentCapacity = Number(user?.currentCapacity) || 0;
  const maxCapacity = Number(user?.maxCapacity) || 100;
  const availableHours = Math.max(0, maxCapacity - currentCapacity);

  // Clamp bar width to 100%
  const capacityBarWidth = Math.min(100, (currentCapacity / maxCapacity) * 100);

  const recentAssignments = [...assignments]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 4);

  // Recent projects (sorted by creation date descending)
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Section */}
        <div className="relative bg-gradient-to-r from-[#515caa] to-slate-600 rounded-2xl md:rounded-[30px] p-4 sm:p-6 md:p-8 text-white overflow-hidden mb-4 sm:mb-8">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 bg-white/5 rounded-full -translate-y-8 sm:-translate-y-16 translate-x-8 sm:translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-20 sm:h-20 bg-white/10 rounded-full translate-y-5 sm:translate-y-10 -translate-x-5 sm:-translate-x-10"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex sm:items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className=" text-lg sm:text-3xl font-bold mb-1 truncate">
                    Welcome back,
                    <span className="block sm:inline md:block lg:inline">
                      {user?.name}!
                    </span>
                  </h1>
                  <p className="text-white/80 text-[14px] sm:text-lg">
                    Ready to tackle your projects today?
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 sm:mt-4">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                  <span className="text-xs sm:text-sm">
                    Active Projects: {activeProjects.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-2 h-2 bg-cyan-300 rounded-full"></div>
                  <span className="text-xs sm:text-sm">
                    Pending Tasks: {pendingTasks.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Capacity Card */}
            <div className="w-full md:w-auto mt-4 md:mt-0 text-center bg-white/15 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <div className="text-xs sm:text-sm text-white/80 font-medium">
                  Current Capacity
                </div>
              </div>

              <div className="relative mb-2 sm:mb-3">
                <div className="text-2xl sm:text-4xl font-bold text-white">
                  {currentCapacity}%
                </div>
                <div className="text-xs text-white/70 mt-1">
                  of {maxCapacity}% max
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${capacityBarWidth}%`, // CLAMPED TO 100%
                  }}
                ></div>
              </div>

              <div className="text-xs text-white/70">
                {currentCapacity < 80 ? "Great capacity!" : "Almost at limit"}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 sm:mt-6 flex justify-start">
            <button
              className="w-full md:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-[20px] sm:rounded-[15px] font-medium transition-all duration-200 border border-white/30 hover:border-white/50"
              onClick={() => navigate("/engineer/projects")}
            >
              View All Projects →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Enhanced Recent Assignments */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                Recent Assignments
              </h3>
              <button
                onClick={() => {
                  navigate("/engineer/assignments");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all duration-200"
              >
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {recentAssignments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No recent assignments found</p>
                </div>
              ) : (
                recentAssignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="group bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(assignment.status)}
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {assignment.description}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 truncate">
                          Project: {assignment.projectId?.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>Role: {assignment.role}</span>
                          <span>•</span>
                          <span>
                            Allocation: {assignment.allocationPercentage}%
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-medium border ${getStatusColor(
                            assignment.status
                          )}`}
                        >
                          {assignment.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(assignment.startDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-400">
                        Due: {formatDate(assignment.endDate)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Enhanced Recent Projects */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-emerald-600" />
                </div>
                Recent Projects
              </h3>
              <button
                onClick={() => {
                  navigate("/engineer/projects");
                }}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-semibold bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-all duration-200"
              >
                View All →
              </button>
            </div>

            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No recent projects found</p>
                </div>
              ) : (
                recentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="group bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(project.status)}
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {project.name}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{project.teamSize} members</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            <span>{project.progress}% complete</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-medium border ${getPriorityColor(
                            project.priority
                          )}`}
                        >
                          {project.priority}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-medium border ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {project.requiredSkills
                          ?.slice(0, 3)
                          .map((skill: any, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        {project.requiredSkills?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            +{project.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        Due: {formatDate(project.endDate)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
