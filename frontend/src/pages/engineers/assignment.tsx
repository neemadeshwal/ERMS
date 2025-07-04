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
        // Fetch all assignments, then filter for this engineer
        const res = await getAllAssignments(token);
        const allAssignments = res.assignments || [];
        // Filter for assignments assigned to this engineer
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
    <div className="space-y-12 py-2">
      {/* Header Section */}
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-1">
            Manage your current and upcoming assignments
          </p>
        </div>
        <button className="bg-[#515caa] hover:bg-[#454a94] text-white px-6 py-3 rounded-[8px] font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Request Assignment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeAssignments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100  rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Allocation</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalAllocation}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingAssignments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 py-8 rounded-[15px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Assignments</p>
              <p className="text-2xl font-bold text-red-600">
                {overdueAssignments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Active Assignments
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Priority</option>
                <option>Due Date</option>
                <option>Allocation</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : activeAssignments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No active assignments.
            </div>
          ) : (
            <div className="space-y-8 flex flex-col gap-6">
              {activeAssignments.map((assignment) => (
                <div
                  key={assignment._id || assignment.id}
                  className="border border-gray-200 rounded-[15px] p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {assignment.project?.name || "No Project"}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                      <p className="text-gray-600 mb-3">
                        {assignment.project?.description}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
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
                      <div className="text-sm text-gray-500 mb-1">
                        Allocation
                      </div>
                      <div className="text-2xl font-bold text-[#515caa]">
                        {assignment.allocationPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Project Progress</span>
                      <span>{assignment.project?.progress ?? "—"}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#515caa] to-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${assignment.project?.progress ?? 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Allocation Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Time Allocation</span>
                      <span>{assignment.allocationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${assignment.allocationPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <button className="bg-[#515caa] hover:bg-[#454a94] text-white px-4 py-2 rounded-[5px] text-sm font-medium transition-colors">
                      View Details
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-[5px] text-sm font-medium transition-colors">
                      Update Progress
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-[5px] text-sm font-medium transition-colors">
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
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Upcoming Assignments
          </h2>
          <p className="text-gray-600 mt-1">
            Assignments scheduled to start soon
          </p>
        </div>

        <div className="p-6">
          {upcomingAssignments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No upcoming assignments.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment._id || assignment.id}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[15px] p-6 border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {assignment.project?.name || "No Project"}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {assignment.project?.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
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

                    <div className="text-center">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {assignment.daysUntilStart} days
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-blue-200">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[5px] text-sm font-medium transition-colors">
                      View Details
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-[5px] text-sm font-medium transition-colors border border-gray-300">
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
