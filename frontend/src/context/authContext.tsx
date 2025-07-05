import { getUser } from "@/actions/auth/auth-action";
import type { User } from "@/types/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Enhanced cookie settings for production
  const cookieSettings = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    `path=/`,
    `SameSite=Strict`,
  ];

  // Only add Secure flag in production (HTTPS)
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

  // Only add Secure flag in production (HTTPS)
  if (window.location.protocol === "https:") {
    cookieSettings.push("Secure");
  }

  document.cookie = cookieSettings.join(";");
};

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const refreshUser = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const data = await getUser(token);
        if (data && data.success && data.user) {
          setUser(data.user);
          setRole(data.user.role);
          // Update role cookie in case it changed
          setCookie("userRole", data.user.role);
        } else {
          // Token is invalid, clear everything
          console.warn("Token validation failed, logging out");
          logout();
        }
      } catch (err) {
        console.error("Error refreshing user:", err);
        // Token is invalid, clear everything
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

  // Initialize auth state from cookies on app start
  useEffect(() => {
    try {
      const storedToken = getCookie("authToken");
      const storedRole = getCookie("userRole");

      console.log("Initializing auth state:", {
        hasToken: !!storedToken,
        hasRole: !!storedRole,
        environment: process.env.NODE_ENV,
      });

      if (storedToken && storedRole) {
        setToken(storedToken);
        setRole(storedRole);
      } else {
        // Clear any partial auth state
        setToken(null);
        setRole(null);
        setUser(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error initializing auth state:", error);
      // Clear everything on error
      setToken(null);
      setRole(null);
      setUser(null);
      setIsLoading(false);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Refresh user data when token changes and after initialization
  useEffect(() => {
    if (isInitialized) {
      refreshUser();
    }
    // eslint-disable-next-line
  }, [token, isInitialized]);

  const login = (newToken: string, userRole: string) => {
    try {
      console.log("Logging in user:", {
        role: userRole,
        environment: process.env.NODE_ENV,
      });

      setToken(newToken);
      setRole(userRole);
      setCookie("authToken", newToken, 7); // Set for 7 days
      setCookie("userRole", userRole, 7); // Set for 7 days

      console.log("Login successful, cookies set");
    } catch (error) {
      console.error("Error during login:", error);
      throw error; // Re-throw to handle in component
    }
  };

  const logout = () => {
    console.log("Logging out user");
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
