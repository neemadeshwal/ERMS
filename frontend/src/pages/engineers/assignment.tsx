import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useEffect, useMemo, useState } from "react";
import { getAllAssignments } from "@/actions/assignments/assignment-action";
import { useNavigate } from "react-router-dom";

const EngineerAssignment = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user || !token) return;
      setLoading(true);
      try {
        const res = await getAllAssignments(token);
        const allAssignments = res.assignments || [];
        const engineerAssignments = allAssignments.filter(
          (a: any) =>
            a.engineerId === user._id ||
            (Array.isArray(a.engineerId) && a.engineerId.includes(user._id))
        );
        setAssignments(engineerAssignments);
      } catch (e) {
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user, token]);

  const today = new Date();

  // Active assignments: status is "active" and startDate <= today
  const activeAssignments = useMemo(
    () =>
      assignments.filter(
        (a) =>
          a.status?.toLowerCase() === "active" && new Date(a.startDate) <= today
      ),
    [assignments, today]
  );

  // Upcoming assignments: startDate > today
  const upcomingAssignments = useMemo(
    () =>
      assignments
        .filter(
          (a) =>
            new Date(a.startDate) > today &&
            (!a.status || a.status.toLowerCase() !== "completed")
        )
        .map((a) => ({
          ...a,
          daysUntilStart: Math.ceil(
            (new Date(a.startDate).getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        })),
    [assignments, today]
  );

  // Overdue assignments: endDate < today and not completed
  const overdueAssignments = useMemo(
    () =>
      assignments.filter(
        (a) =>
          new Date(a.endDate) < today &&
          (!a.status || a.status.toLowerCase() !== "completed")
      ),
    [assignments, today]
  );

  // Total allocation for active assignments
  const totalAllocation = activeAssignments.reduce(
    (sum, a) => sum + (a.allocationPercentage || 0),
    0
  );

  return (
    <div className="space-y-10 sm:space-y-12 py-2 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Assignments
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage your current and upcoming assignments
          </p>
        </div>
        <button className="bg-[#515caa] hover:bg-[#454a94] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-[8px] font-medium transition-colors flex items-center gap-2 w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          Request Assignment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 py-6 sm:py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Assignments</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {activeAssignments.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100  rounded-full flex items-center justify-center">
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
              <p className="text-sm text-gray-600">Upcoming Assignments</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {upcomingAssignments.length}
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
              <p className="text-sm text-gray-600">Overdue Assignments</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {overdueAssignments.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Active Assignments
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
          ) : activeAssignments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No active assignments.
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 flex flex-col gap-4 sm:gap-6">
              {activeAssignments.map((assignment) => (
                <div
                  key={assignment._id || assignment.id}
                  className="border border-gray-200 rounded-[15px] p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                          {assignment.project?.name || "No Project"}
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            assignment.priority?.toLowerCase() === "high"
                              ? "bg-red-100 text-red-700"
                              : assignment.priority?.toLowerCase() === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {assignment.priority
                            ? assignment.priority.charAt(0).toUpperCase() +
                              assignment.priority.slice(1)
                            : "Medium"}{" "}
                          Priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm">
                        {assignment.project?.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Role: {assignment.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {assignment.startDate} - {assignment.endDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            Progress: {assignment.project?.progress ?? "—"}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1">
                        Allocation
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-[#515caa]">
                        {assignment.allocationPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>Project Progress</span>
                      <span>{assignment.project?.progress ?? "—"}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-[#515caa] to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            assignment.project?.progress ?? 0
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Allocation Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>Time Allocation</span>
                      <span>{assignment.allocationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            assignment.allocationPercentage
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

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Upcoming Assignments
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Assignments scheduled to start soon
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {upcomingAssignments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No upcoming assignments.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment._id || assignment.id}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[15px] p-4 sm:p-6 border border-blue-100"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        {assignment.project?.name || "No Project"}
                      </h4>
                      <p className="text-gray-600 mb-3 text-sm">
                        {assignment.project?.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{assignment.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{assignment.allocationPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-2 md:mt-0">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {assignment.daysUntilStart} days
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

export default EngineerAssignment;
