import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import EngineerDashboard from "./pages/engineers/dashboard";
import EngineerAssignment from "./pages/engineers/assignment";
import EngineerProfile from "./pages/engineers/profile";
import EngineerCapacity from "./pages/engineers/capacityOverview";
import EngineerSidebar from "./features/sidebar";
import ManagerSidebar from "./features/managerSidebar";
import ManagerCapacityOverview from "./pages/managers/capacity";
import ManagerAssignments from "./pages/managers/assignments";
import ManagerProjects from "./pages/managers/projects";
import ManagerDashboard from "./pages/managers/dashboard";
import ManagerTeamManagement from "./pages/managers/teamManagement";
import { ProtectedRoute } from "./protectedRoute";
import ProjectDetailPage from "./pages/managers/projectDetailPage";
import AssignmentDetailPage from "./pages/managers/assignmentDetail";
import EngineerProject from "./pages/engineers/project";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/engineer",
    element: (
      // <ProtectedRoute allowedRoles={["engineer"]}>
      <EngineerSidebar />
      // </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <EngineerDashboard />,
      },
      {
        path: "assignments",
        element: <EngineerAssignment />,
      },
      {
        path: "capacity-overview",
        element: <EngineerCapacity />,
      },
      {
        path: "profile",
        element: <EngineerProfile />,
      },
      {
        path: "projects",
        element: <EngineerProject />,
      },
    ],
  },
  {
    path: "/manager",
    element: (
      // <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerSidebar />
      // </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <ManagerDashboard />,
      },

      {
        path: "team-management",
        element: <ManagerTeamManagement />,
      },
      {
        path: "assignments",
        element: <ManagerAssignments />,
      },
      {
        path: "projects",
        element: <ManagerProjects />,
      },
      {
        path: "projects/:id",
        element: <ProjectDetailPage />,
      },
      {
        path: "capacity-overview",
        element: <ManagerCapacityOverview />,
      },
      {
        path: "assignments/:id",
        element: <AssignmentDetailPage />,
      },
    ],
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
