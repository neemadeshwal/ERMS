import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useEffect, useMemo, useState } from "react";
import { getAllProjects } from "@/actions/project/project-actions";

const EngineerProject = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user || !token) return;
      setLoading(true);
      try {
        const res = await getAllProjects(token);
        setProjects(res.projects || []);
      } catch (e) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user, token]);

  const today = new Date();

  // Active projects: status is "active" and startDate <= today
  const activeProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.status?.toLowerCase() === "active" && new Date(p.startDate) <= today
      ),
    [projects, today]
  );

  // Upcoming projects: startDate > today
  const upcomingProjects = useMemo(
    () =>
      projects
        .filter(
          (p) =>
            new Date(p.startDate) > today &&
            (!p.status || p.status.toLowerCase() !== "completed")
        )
        .map((p) => ({
          ...p,
          daysUntilStart: Math.ceil(
            (new Date(p.startDate).getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        })),
    [projects, today]
  );

  // Overdue projects: endDate < today and not completed
  const overdueProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          new Date(p.endDate) < today &&
          (!p.status || p.status.toLowerCase() !== "completed")
      ),
    [projects, today]
  );

  // Total allocation: sum of allocationPercentage for active projects (if available)
  const totalAllocation = activeProjects.reduce(
    (sum, p) =>
      sum + (p.assignment?.allocationPercentage || p.allocationPercentage || 0),
    0
  );

  return (
    <div className="space-y-10 sm:space-y-12 py-2 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Projects
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your current and upcoming projects
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 py-6 sm:py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {activeProjects.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 py-6 sm:py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Allocation</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {totalAllocation}%
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 py-6 sm:py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Projects</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {upcomingProjects.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 py-6 sm:py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Projects</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {overdueProjects.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Active Projects
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1">
                <option>Priority</option>
                <option>Due Date</option>
                <option>Allocation</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : activeProjects.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No active projects.
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 flex flex-col gap-4 sm:gap-6">
              {activeProjects.map((project) => (
                <div
                  key={project._id || project.id}
                  className="border border-gray-200 rounded-[15px] p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                          {project.name}
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            project.priority?.toLowerCase() === "high"
                              ? "bg-red-100 text-red-700"
                              : project.priority?.toLowerCase() === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {project.priority
                            ? project.priority.charAt(0).toUpperCase() +
                              project.priority.slice(1)
                            : "Medium"}{" "}
                          Priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            Role:{" "}
                            {project.assignment?.role || project.role || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {project.startDate} - {project.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Progress: {project.progress ?? "—"}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">
                        Allocation
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-[#515caa]">
                        {project.assignment?.allocationPercentage ||
                          project.allocationPercentage ||
                          0}
                        %
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>Project Progress</span>
                      <span>{project.progress ?? "—"}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-[#515caa] to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, project.progress ?? 0)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Allocation Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>Time Allocation</span>
                      <span>
                        {project.assignment?.allocationPercentage ||
                          project.allocationPercentage ||
                          0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            project.assignment?.allocationPercentage ||
                              project.allocationPercentage ||
                              0
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                    <button className="bg-[#515caa] hover:bg-[#454a94] text-white px-3 sm:px-4 py-2 rounded-[5px] text-xs sm:text-sm font-medium transition-colors">
                      View Details
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-[5px] text-xs sm:text-sm font-medium transition-colors">
                      Update Progress
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-[5px] text-xs sm:text-sm font-medium transition-colors">
                      Request Change
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Projects */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Upcoming Projects
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Projects scheduled to start soon
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {upcomingProjects.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No upcoming projects.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {upcomingProjects.map((project) => (
                <div
                  key={project._id || project.id}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[15px] p-4 sm:p-6 border border-blue-100"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        {project.name}
                      </h4>
                      <p className="text-gray-600 mb-3 text-sm">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>
                            {project.assignment?.role || project.role || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>
                            {project.assignment?.allocationPercentage ||
                              project.allocationPercentage ||
                              0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-2 md:mt-0">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {project.daysUntilStart} days
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-blue-200">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-[5px] text-xs sm:text-sm font-medium transition-colors">
                      View Details
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-[5px] text-xs sm:text-sm font-medium transition-colors border border-gray-300">
                      Set Reminder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngineerProject;
