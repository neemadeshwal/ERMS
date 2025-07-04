import { useAuth } from "@/context/authContext";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    // Logged in but not allowed
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
