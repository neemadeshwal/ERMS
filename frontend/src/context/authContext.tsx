// src/context/authContext.tsx

import { getUser } from "@/actions/auth/auth-action";
import type { User } from "@/types/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// --- Types ---
interface AuthContextType {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
  user: User | null;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// --- Role-based Dashboard Route Helper ---
export function getDashboardRoute(role: string | null) {
  if (role === "manager") return "/manager";
  if (role === "engineer") return "/engineer";
  // Add more roles as needed
  return "/";
}

// --- Cookie Helpers ---
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieSettings = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    `path=/`,
    `SameSite=Strict`,
  ];

  if (window.location.protocol === "https:") {
    cookieSettings.push("Secure");
  }

  document.cookie = cookieSettings.join(";");
};

const getCookie = (name: string): string | null => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.startsWith(nameEQ)) {
        return c.substring(nameEQ.length);
      }
    }
    return null;
  } catch (error) {
    console.error("Error reading cookie:", error);
    return null;
  }
};

const deleteCookie = (name: string) => {
  const cookieSettings = [
    `${name}=`,
    `expires=Thu, 01 Jan 1970 00:00:00 UTC`,
    `path=/`,
    `SameSite=Strict`,
  ];
  if (window.location.protocol === "https:") {
    cookieSettings.push("Secure");
  }
  document.cookie = cookieSettings.join(";");
};

// --- Auth Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Fetch user from API using token
  const refreshUser = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const data = await getUser(token);
        if (data && data.success && data.user) {
          setUser(data.user);
          setRole(data.user.role);
          setCookie("userRole", data.user.role);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Error refreshing user:", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  };

  // On mount, initialize from cookies
  useEffect(() => {
    try {
      const storedToken = getCookie("authToken");
      const storedRole = getCookie("userRole");
      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);
      } else {
        setToken(null);
        setRole(null);
        setUser(null);
        setIsLoading(false);
      }
    } catch (error) {
      setToken(null);
      setRole(null);
      setUser(null);
      setIsLoading(false);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Refresh user when token changes or after initialization
  useEffect(() => {
    if (isInitialized) {
      refreshUser();
    }
    // eslint-disable-next-line
  }, [token, isInitialized]);

  // Login: set token, role, and cookies
  const login = (newToken: string, userRole: string) => {
    setToken(newToken);
    setRole(userRole);
    setCookie("authToken", newToken, 7);
    setCookie("userRole", userRole, 7);
  };

  // Logout: clear everything
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    deleteCookie("authToken");
    deleteCookie("userRole");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        refreshUser,
        user,
        isAuthenticated: !!token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook to use Auth Context ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
