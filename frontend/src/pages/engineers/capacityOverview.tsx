import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  BarChart3,
  Target,
  Activity,
  AlertTriangle,
  Settings,
  Download,
  Filter,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/authContext";
import { getSingleAssignment } from "@/actions/assignments/assignment-action";

const RECOMMENDED_CAPACITY = 90;

const EngineerCapacity = () => {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("current");
  const [showDetailed, setShowDetailed] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user || !token) return;
      setLoading(true);
      try {
        const res = await getSingleAssignment(user._id, token);
        setAssignments(res.assignments || []);
      } catch (e) {
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user, token]);

  // Calculate stats
  const today = new Date();
  const maxCapacity = Number(user?.maxCapacity) || 100;
  const currentAllocation = Math.min(100, Number(user?.currentCapacity) || 0);
  const hoursPerWeek = Number(user?.hoursPerWeek) || 40;
  const efficiency = Number(user?.efficiency) || 92;

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

  // Total allocation for active
  const totalActiveAllocation = Math.min(
    100,
    activeAssignments.reduce((sum, a) => sum + (a.allocationPercentage || 0), 0)
  );

  // Total allocation for upcoming
  const totalUpcomingAllocation = Math.min(
    100,
    upcomingAssignments.reduce(
      (sum, a) => sum + (a.allocationPercentage || 0),
      0
    )
  );

  // Projected allocation
  const projectedAllocation = Math.min(
    100,
    currentAllocation + totalUpcomingAllocation
  );

  // Available capacity
  const availableCapacity = Math.max(0, maxCapacity - currentAllocation);

  // Capacity status
  const getCapacityStatus = () => {
    if (currentAllocation > RECOMMENDED_CAPACITY) {
      return { status: "overloaded", color: "red", message: "Overloaded" };
    } else if (currentAllocation > 80) {
      return { status: "high", color: "yellow", message: "High Utilization" };
    } else if (currentAllocation > 60) {
      return { status: "optimal", color: "green", message: "Optimal" };
    } else {
      return { status: "low", color: "blue", message: "Under-utilized" };
    }
  };
  const capacityStatus = getCapacityStatus();

  return (
    <div className="space-y-8 px-2 sm:px-4 md:px-8 py-2 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Capacity Analysis
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Monitor workload distribution and availability
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3"></div>
      </div>
      {/* Status Alert */}
      <div
        className={`p-4 rounded-[20px] border-l-4 ${
          capacityStatus.status === "overloaded"
            ? "bg-red-50 border-red-400"
            : capacityStatus.status === "high"
            ? "bg-yellow-50 border-yellow-400"
            : capacityStatus.status === "optimal"
            ? "bg-green-50 border-green-400"
            : "bg-blue-50 border-blue-400"
        }`}
      >
        <div className="flex items-center gap-3">
          {capacityStatus.status === "overloaded" ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : capacityStatus.status === "high" ? (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          ) : capacityStatus.status === "optimal" ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Activity className="w-5 h-5 text-blue-500" />
          )}
          <div>
            <p
              className={`font-medium ${
                capacityStatus.status === "overloaded"
                  ? "text-red-800"
                  : capacityStatus.status === "high"
                  ? "text-yellow-800"
                  : capacityStatus.status === "optimal"
                  ? "text-green-800"
                  : "text-blue-800"
              }`}
            >
              Current Status: {capacityStatus.message}
            </p>
            <p
              className={`text-sm ${
                capacityStatus.status === "overloaded"
                  ? "text-red-600"
                  : capacityStatus.status === "high"
                  ? "text-yellow-600"
                  : capacityStatus.status === "optimal"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              {capacityStatus.status === "overloaded" &&
                "Consider redistributing workload or extending deadlines"}
              {capacityStatus.status === "high" &&
                "Monitor closely to prevent burnout"}
              {capacityStatus.status === "optimal" &&
                "Excellent balance between productivity and well-being"}
              {capacityStatus.status === "low" &&
                "Opportunity to take on additional projects"}
            </p>
          </div>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-[20px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Capacity</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">
                {availableCapacity}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {((availableCapacity * hoursPerWeek) / 100).toFixed(1)} hrs/week
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-[20px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Allocation</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">
                {currentAllocation}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {((currentAllocation * hoursPerWeek) / 100).toFixed(1)} hrs/week
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-[20px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Efficiency Score</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-700">
                {efficiency}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Above average</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-[20px] shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Projected Load</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-700">
                {projectedAllocation}%
              </p>
              <p className="text-xs text-gray-500 mt-1">With upcoming</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Capacity Visualization */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Capacity Overview
            </h2>
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                className="text-sm border border-gray-300 rounded-[20px] px-2 sm:px-3 py-2"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="current">Current Period</option>
                <option value="projected">Including Upcoming</option>
                <option value="historical">Historical View</option>
              </select>
              <button
                onClick={() => setShowDetailed(!showDetailed)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-[20px] transition-colors"
              >
                {showDetailed ? "Simple View" : "Detailed View"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Main Capacity Bar */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-3">
                <span>Overall Capacity Utilization</span>
                <span>
                  {currentAllocation}% of {maxCapacity}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 sm:h-6">
                  <div
                    className="bg-gradient-to-r from-[#515caa] to-blue-500 h-4 sm:h-6 rounded-full transition-all duration-500 relative"
                    style={{ width: `${currentAllocation}%` }}
                  >
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-medium">
                      {currentAllocation}%
                    </div>
                  </div>
                </div>
                {/* Recommended capacity marker */}
                <div
                  className="absolute top-0 h-4 sm:h-6 w-0.5 bg-yellow-500"
                  style={{ left: `${RECOMMENDED_CAPACITY}%` }}
                >
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs text-yellow-600 font-medium">
                    Recommended
                  </div>
                </div>
              </div>
            </div>

            {/* Project Breakdown */}
            <div className="bg-gray-50 p-4 rounded-[20px]">
              <h3 className="font-medium text-gray-900 mb-4">
                Current Project Allocation
              </h3>
              <div className="space-y-3">
                {activeAssignments.map((assignment, index) => (
                  <div
                    key={assignment._id || assignment.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white rounded-[20px] gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      ></div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {assignment.project?.name}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>{assignment.role}</span>
                          <span>
                            {assignment.hoursPerWeek
                              ? `${assignment.hoursPerWeek} hrs/week`
                              : ""}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full ${
                              assignment.priority?.toLowerCase() === "high"
                                ? "bg-red-100 text-red-700"
                                : assignment.priority?.toLowerCase() ===
                                  "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {assignment.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <div className="w-20 sm:w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                              ? "bg-green-500"
                              : "bg-purple-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              assignment.allocationPercentage
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">
                        {Math.min(100, assignment.allocationPercentage)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showDetailed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Weekly Hours Breakdown */}
                <div className="bg-gray-50 p-4 rounded-[20px]">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Weekly Hours Breakdown
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Regular Hours</span>
                      <span className="font-medium">{hoursPerWeek} hrs</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available Hours</span>
                      <span className="font-medium text-green-600">
                        {((availableCapacity * hoursPerWeek) / 100).toFixed(1)}{" "}
                        hrs
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total Capacity</span>
                        <span>{hoursPerWeek ?? 40} hrs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacity Trends */}
                <div className="bg-gray-50 p-4 rounded-[20px]">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Capacity Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Optimal allocation range: 70-90%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Current efficiency: {efficiency}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Projected next month: {projectedAllocation}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Skills utilization: High
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerCapacity;
