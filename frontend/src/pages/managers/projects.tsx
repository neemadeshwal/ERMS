import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Activity,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  Briefcase,
  Grid,
  List,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectForm from "./projectForm";
import { useAuth } from "@/context/authContext";
import { getAllProjects } from "@/actions/project/project-actions";
import type { Project } from "@/types/types";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  onhold: {
    color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    bgColor: "bg-blue-50 border-blue-200",
    icon: Clock,
  },
  active: {
    color: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
    bgColor: "bg-emerald-50 border-emerald-200",
    icon: Activity,
  },
  completed: {
    color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    bgColor: "bg-gray-50 border-gray-200",
    icon: Star,
  },
  "on-hold": {
    color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    bgColor: "bg-blue-50 border-blue-200",
    icon: Clock,
  },
};

const priorityConfig = {
  high: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  medium: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
  low: "bg-gradient-to-r from-green-500 to-green-600 text-white",
};

export default function ProjectListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const { token } = useAuth();
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const [projectArray, setProjectArray] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await getAllProjects(token);
        setProjectArray(Array.isArray(data.projects) ? data.projects : []);
      } catch (err) {
        setProjectArray([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProjects();
  }, [token]);

  const filteredProjects = useMemo(() => {
    if (!projectArray || projectArray.length === 0) return [];
    return projectArray.filter((project: Project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof project.managerId.name === "string" &&
          project.managerId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || project.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter, projectArray]);

  const stats = useMemo(() => {
    const total = projectArray ? projectArray.length : 0;
    const active = projectArray
      ? projectArray.filter((p: Project) => p.status === "active").length
      : 0;
    const completed = projectArray
      ? projectArray.filter((p: Project) => p.status === "completed").length
      : 0;
    const onHold = projectArray
      ? projectArray.filter((p: Project) => p.status === "on-hold").length
      : 0;

    return { total, active, completed, onHold };
  }, [projectArray]);

  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <div
        onClick={() => navigate(project._id)}
        className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {project.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.requiredSkills?.slice(0, 3).map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#4b5c9a] via-[#5c66a7] to-[#7d89c4] text-white rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
            {project.requiredSkills?.length > 3 && (
              <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                +{project.requiredSkills.length - 3} more
              </span>
            )}
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-gray-800">
                {project.progress ?? 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000"
                style={{
                  width: `${project.progress ?? 0}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {project.teamMembers?.length ?? 0}/{project.teamSize}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusConfig[project.status]?.color ??
                  "bg-gray-200 text-gray-700"
                } shadow-lg`}
              >
                {project.status.charAt(0).toUpperCase() +
                  project.status.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  priorityConfig[project.priority] ??
                  "bg-gray-200 text-gray-700"
                } shadow-lg`}
              >
                {project.priority.charAt(0).toUpperCase() +
                  project.priority.slice(1)}
              </span>
            </div>
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-200 group">
              <span className="text-sm font-medium">View Details</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProjectRow = ({ project }: { project: Project }) => {
    const StatusIcon = statusConfig[project.status]?.icon ?? Activity;

    return (
      <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group">
        <td className="py-4 px-6">
          <div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 truncate max-w-xs">
              {project.description}
            </p>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4 text-gray-500" />
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusConfig[project.status]?.color ??
                "bg-gray-200 text-gray-700"
              } shadow-sm`}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
        </td>
        <td className="py-4 px-6">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              priorityConfig[project.priority] ?? "bg-gray-200 text-gray-700"
            } shadow-sm`}
          >
            {project.priority.charAt(0).toUpperCase() +
              project.priority.slice(1)}
          </span>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-1000"
                style={{
                  width: `${project.progress ?? 0}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {project.progress ?? 0}%
            </span>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="text-sm text-gray-600">
            <p>
              {project.teamMembers?.length ?? 0}/{project.teamSize} engineers
            </p>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="text-sm text-gray-600">
            <p>
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </td>
        <td className="py-4 px-6">
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-2">
              Projects
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track all your engineering projects
            </p>
          </div>
          <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => setProjectDialogOpen(true)}
                className="bg-[#515caa] hover:bg-[#454a94] text-white px-6 py-2 rounded-[15px] font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[15px] w-[80vw] min:w-[80vw] h-[90%]">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription className="w-full">
                  <ProjectForm setOpen={setProjectDialogOpen} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.active}
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
                <p className="text-sm text-gray-600">Completed Projects</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On hold</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.onHold}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 p-6 rounded-2xl shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="on-hold">On hold</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white shadow-md text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white shadow-md text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project, index: number) => (
              <div
                key={project._id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Project
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Priority
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Progress
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Team
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProjects.map((project, index) => (
                    <ProjectRow key={project._id} project={project} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
