import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import UserProfile from "./userProfile";
import { useAuth } from "@/context/authContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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

const SidebarContent = ({ user, onItemClick }: any) => (
  <>
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
            onClick={onItemClick}
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
  </>
);

const ManagerSidebar = () => {
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleItemClick = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={emrsLogo} alt="EMRS Logo" className="w-8 h-8" />
          <span className="font-semibold text-lg">EMRS</span>
        </div>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-full max-h-[96vh] bg-white">
            <DrawerHeader className="text-left">
              <DrawerTitle className="sr-only">Navigation Menu</DrawerTitle>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Navigation</span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent user={user} onItemClick={handleItemClick} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-80 h-screen lg:inline-block hidden bg-white fixed left-0 top-0 shadow-lg z-10">
        <SidebarContent user={user} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-80 overflow-auto">
        {/* Add top padding for mobile header */}
        <div className="p-6 lg:pt-6 pt-20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerSidebar;
