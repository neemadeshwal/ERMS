import { useState, useEffect } from "react";
import { BarChart3, Calendar } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { getAllAssignments } from "@/actions/assignments/assignment-action";
import { getAllProjects } from "@/actions/project/project-actions";
import { useNavigate } from "react-router-dom";

const EngineerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Recent assignments (sorted by start date descending)
  const recentAssignments = [...assignments]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 3);

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

        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Assignments Preview */}
          <div className="bg-white rounded-[20px] sm:rounded-[20px] shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Recent Assignments
              </h3>
              <button
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate("/assignments")}
              >
                View All →
              </button>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {recentAssignments.length === 0 ? (
                <div className="text-gray-400 text-xs sm:text-sm">
                  No recent assignments.
                </div>
              ) : (
                recentAssignments.map((assignment, index) => (
                  <div
                    key={assignment._id || index}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-[15px]"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                        {assignment.projectName || assignment.role}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status?.toLowerCase() === "completed"
                            ? "bg-green-100 text-green-800"
                            : assignment.status?.toLowerCase() === "active"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Capacity Overview Preview */}
          <div className="bg-white rounded-[20px] sm:rounded-[20px] shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Capacity Overview
              </h3>
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                View Details →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-blue-50 rounded-lg sm:rounded-[15px] p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">
                  {currentCapacity}%
                </div>
                <div className="text-xs text-blue-600">Current Load</div>
              </div>
              <div className="bg-green-50 rounded-lg sm:rounded-[15px] p-2 sm:p-3 text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {availableHours}h
                </div>
                <div className="text-xs text-green-600">Available</div>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                This Week
              </div>
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => {
                // For demo, just use random or static values
                const capacity = [80, 60, 90, 45, 70][index];
                return (
                  <div key={day} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs text-gray-500 w-7 sm:w-8">
                      {day}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-1 sm:h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 sm:h-1.5 rounded-full"
                        style={{ width: `${capacity}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-7 sm:w-8">
                      {capacity}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
