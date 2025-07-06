// ProjectDetailPage.tsx
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Briefcase,
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import {
  getSingleProject,
  deleteProject,
} from "@/actions/project/project-actions";
import type { Project } from "@/types/types";
import { toast } from "sonner"; // or your preferred toast library
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectForm from "./projectForm";
// Mock Engineers
export const mockEngineers = [
  {
    id: "e1",
    name: "Sarah Williams",
    avatar: "SW",
    department: "Frontend",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "e2",
    name: "John Chen",
    avatar: "JC",
    department: "Backend",
    skills: ["Python", "Django", "PostgreSQL"],
  },
  {
    id: "e3",
    name: "Emma Rodriguez",
    avatar: "ER",
    department: "Frontend",
    skills: ["React", "Vue.js", "CSS"],
  },
];

// Mock Assignments for project p1
export const mockAssignments = [
  {
    id: "a1",
    engineerId: "e1",
    projectId: "p1",
    allocationPercentage: 60,
    role: "Tech Lead",
    startDate: "2025-06-01",
    endDate: "2025-08-15",
    status: "active",
    priority: "high",
    description: "Leading the frontend development team",
  },
  {
    id: "a2",
    engineerId: "e2",
    projectId: "p1",
    allocationPercentage: 40,
    role: "Backend Developer",
    startDate: "2025-06-15",
    endDate: "2025-08-10",
    status: "active",
    priority: "medium",
    description: "Implementing backend APIs",
  },
  {
    id: "a3",
    engineerId: "e3",
    projectId: "p1",
    allocationPercentage: 30,
    role: "UI Developer",
    startDate: "2025-07-01",
    endDate: "2025-08-01",
    status: "active",
    priority: "low",
    description: "Building responsive UI components",
  },
];

const statusColor: Record<string, string> = {
  onHold: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
  active:
    "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg",
  completed: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
};

const priorityColor: Record<string, string> = {
  high: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
  medium: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg",
  low: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [engineers, setEngineers] = useState(mockEngineers);
  const [loading, setLoading] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      if (!token || !id) return;
      try {
        setLoading(true);
        const data = await getSingleProject(id, token);
        setProject(data.project);
        // Optionally, fetch assignments and engineers from backend here
      } catch (err) {
        toast.error("Failed to fetch project.");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [token, id]);

  // Delete Handler
  const handleDelete = async () => {
    if (!id || !token) return;
    try {
      await deleteProject(id, token);
      toast.success("Project deleted successfully!");
      navigate("/projects");
    } catch (err) {
      toast.error("Failed to delete project.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <button
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </button>
      </div>
    );
  }

  const utilizationPercentage = Math.round(
    (assignments.reduce((sum, a) => sum + a.allocationPercentage, 0) /
      (project.teamSize * 100)) *
      100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <button
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group mb-1"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Projects
            </button>
            <h1 className="text-2xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-2 truncate">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                  statusColor[
                    project.status === "on-hold" ? "onHold" : project.status
                  ]
                } transform hover:scale-105 transition-transform duration-200`}
              >
                {project.status.charAt(0).toUpperCase() +
                  project.status.slice(1)}
              </span>
              <div className="flex items-center gap-1 sm:gap-2 text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm">
                <Users className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Team Size: {project.teamSize}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm">
                <Star className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Manager: {project.managerId.name || "—"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Dialog>
              <DialogTrigger>
                <button className="w-auto inline-flex items-center px-3 py-3 sm:px-4 sm:py-3 bg-white border-2 border-gray-300 rounded-[8px] shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-300 text-gray-700 text-sm sm:text-base  sm:mb-0">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-[15px] w-[98vw] sm:w-[80vw] py-3">
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription className="w-full">
                    <ProjectForm editId={id} setOpen={setProjectDialogOpen} />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <button
              className="w-auto sm:w-auto inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white rounded-[8px] shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-red-700 text-sm sm:text-base"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 rounded-2xl shadow-xl border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">
                  Total Assignments
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {assignments.length}
                </p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
            </div>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl shadow-xl border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs sm:text-sm font-medium">
                  Utilization
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {utilizationPercentage}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-200" />
            </div>
          </div>
          <div className="p-4 sm:p-6 rounded-2xl shadow-xl border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-xs sm:text-sm font-medium">
                  Active Status
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {project.status}
                </p>
              </div>
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 mb-6 sm:mb-8">
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
                Project Overview
              </h2>
              <p className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-base sm:text-lg">
                {project.description}
              </p>

              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {project.requiredSkills &&
                    project.requiredSkills.length > 0 &&
                    project.requiredSkills.map((skill, index) => (
                      <span
                        key={skill}
                        className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-800 text-xs sm:text-base">
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Team Composition
                    </p>
                    <p className="font-semibold text-gray-800 text-xs sm:text-base">
                      {project.teamSize} engineers
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-80 w-full">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                  Project Metrics
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Progress
                    </span>
                    <div className="w-16 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
                        style={{ width: `${utilizationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Assignments
                    </span>
                    <span className="font-semibold text-gray-800">
                      {assignments.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-xl shadow-sm">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Utilization
                    </span>
                    <span className="font-semibold text-gray-800">
                      {utilizationPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 mb-8">
        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
            Team Assignments
          </h2>
          {assignments.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Users className="w-10 h-10 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg">
                No engineers assigned yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-700 rounded-l-xl">
                      Engineer
                    </th>
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-700">
                      Allocation
                    </th>
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-700">
                      Timeline
                    </th>
                    <th className="py-3 sm:py-4 px-3 sm:px-6 text-left font-semibold text-gray-700 rounded-r-xl">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignments.map((a, index) => {
                    const eng = engineers.find((e) => e.id === a.engineerId);
                    return (
                      <tr
                        key={a.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg group-hover:shadow-xl transition-all duration-200">
                              {eng?.avatar || "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {eng?.name || "Unknown"}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {eng?.department}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <p className="font-medium text-gray-800">{a.role}</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {a.description}
                          </p>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                                style={{ width: `${a.allocationPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700">
                              {a.allocationPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="text-xs sm:text-sm text-gray-600">
                            <p>{new Date(a.startDate).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400">
                              to {new Date(a.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                              priorityColor[a.priority]
                            } hover:scale-105 transition-transform duration-200`}
                          >
                            {a.priority.charAt(0).toUpperCase() +
                              a.priority.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
