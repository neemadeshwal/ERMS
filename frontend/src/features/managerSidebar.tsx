import { NavLink, Outlet } from "react-router-dom";
import emrsLogo from "../assets/erms.png";

import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  Home,
  Calendar,
  BarChart3,
  User,
  Settings,
  Users,
  Folder,
} from "lucide-react";
import { useState } from "react";
import UserProfile from "./userProfile";
import { useAuth } from "@/context/authContext";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/manager" },
  {
    id: "teamManagement",
    label: "TeamManagements",
    icon: Users,
    path: "/manager/team-management",
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: Calendar,
    path: "/manager/assignments",
  },
  {
    id: "project",
    label: "Projects",
    icon: Folder,
    path: "/manager/projects",
  },
];

const ManagerSidebar = () => {
  const { user } = useAuth();
  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Fixed Sidebar */}
      <aside className="w-80 h-screen bg-white fixed left-0 top-0 shadow-lg z-10">
        <div className="p-4 px-6 font-bold text-xl">
          <img src={emrsLogo} alt="EMRS Logo" className="w-[80px] h-[80px]" />
        </div>
        <hr className="text-gray-200" />
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-[#edeff9] text-[#515caa] font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-base">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        {user && <UserProfile user={user} />}
      </aside>

      {/* Main Content - with left margin to account for fixed sidebar */}
      <div className="flex-1 ml-80 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerSidebar;
