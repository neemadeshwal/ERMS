import React, { useState, useEffect, useMemo } from "react";
import { Users, TrendingUp, AlertCircle, Target } from "lucide-react";
import { getAllEngineers } from "@/actions/engineers/engineer-action";
import { useAuth } from "@/context/authContext";
import type { Project, User } from "@/types/types";
import UserLogo from "@/features/userLogo";

const ManagerTeamManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Fetch engineers from API
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getAllEngineers(token)
      .then((data) =>
        setEngineers(Array.isArray(data.engineer) ? data.engineer : [])
      )
      .catch(() => setEngineers([]))
      .finally(() => setLoading(false));
  }, [token]);

  // Filtering engineers by search term
  const filteredEngineers = useMemo(() => {
    if (!Array.isArray(engineers)) return [];
    return engineers.filter((engineer: User) => {
      const matchesSearch =
        engineer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(engineer.skills) &&
          engineer.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ));
      return matchesSearch;
    });
  }, [engineers, searchTerm]);

  // Key metrics
  const overallStats = useMemo(() => {
    if (!Array.isArray(engineers) || engineers.length === 0) {
      return {
        totalEngineers: 0,
        activeProjects: 0,
        averageUtilization: 0,
        overAllocated: 0,
      };
    }
    const totalEngineers = engineers.length;
    // Optional: If you want to count unique active projects from engineer.projects
    const activeProjects = [
      ...new Set(
        engineers
          .flatMap((e: any) => (Array.isArray(e.projects) ? e.projects : []))
          .filter(Boolean)
      ),
    ].length;
    const averageUtilization = Math.round(
      engineers.reduce(
        (sum, e: any) =>
          sum +
          ((Number(e.currentCapacity) || 0) / (Number(e.maxCapacity) || 1)) *
            100,
        0
      ) / totalEngineers
    );
    const overAllocated = engineers.filter(
      (e: any) => Number(e.currentCapacity) > (Number(e.maxCapacity) || 1) * 0.9
    ).length;
    return {
      totalEngineers,
      activeProjects,
      averageUtilization,
      overAllocated,
    };
  }, [engineers]);

  const getCapacityColor = (allocation: number, maxCapacity: number) => {
    const percentage = (allocation / (maxCapacity || 1)) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      onHold: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      available: "bg-purple-100 text-purple-800",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Team Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your engineering team assignments and capacity
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview */}
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Engineers</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {overallStats.totalEngineers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {overallStats.activeProjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Utilization</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {overallStats.averageUtilization}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Over-allocated</p>
                  <p className="text-3xl font-bold text-red-600">
                    {overallStats.overAllocated}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Team Capacity Overview */}
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Team Capacity Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search engineers by name or skills..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-[15px] focus:ring-2 focus:ring-[#515caa] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {loading ? (
                <div className="text-center text-gray-400 py-8">Loading...</div>
              ) : (
                <div className="space-y-4">
                  {filteredEngineers.length > 0 ? (
                    filteredEngineers.map((engineer: User) => (
                      <div
                        key={engineer._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-[15px]"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#515caa] rounded-full flex items-center justify-center text-white font-medium">
                            <UserLogo
                              color={engineer.color}
                              code={engineer.code}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {engineer.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {engineer.department} • {engineer.seniority}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {engineer.currentCapacity}% of{" "}
                              {engineer.maxCapacity}%
                            </p>
                            <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${getCapacityColor(
                                  Number(engineer.currentCapacity),
                                  Number(engineer.maxCapacity)
                                )}`}
                                style={{
                                  width: `${
                                    ((Number(engineer.currentCapacity) || 0) /
                                      (Number(engineer.maxCapacity) || 1)) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              engineer.status
                            )}`}
                          >
                            {engineer.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No engineers found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerTeamManagement;
