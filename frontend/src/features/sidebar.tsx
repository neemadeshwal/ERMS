import { NavLink, Outlet } from "react-router-dom";
import emrsLogo from "../assets/erms.png";

import {
  Home,
  Calendar,
  BarChart3,
  User,
  Settings,
  ChartArea,
} from "lucide-react";
import UserProfile from "./userProfile";
import { useAuth } from "@/context/authContext";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/engineer" },
  {
    id: "assignments",
    label: "My Assignments",
    icon: Calendar,
    path: "/engineer/assignments",
  },
  {
    id: "project",
    label: "Projects",
    icon: ChartArea,
    path: "/engineer/projects",
  },
  {
    id: "capacity",
    label: "Capacity Overview",
    icon: BarChart3,
    path: "/engineer/capacity-overview",
  },
  { id: "profile", label: "Profile", icon: User, path: "/engineer/profile" },
];

const EngineerSidebar = () => {
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

export default EngineerSidebar;
