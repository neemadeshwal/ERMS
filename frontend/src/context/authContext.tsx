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
  login: (token: string, role: string) => void; // Accept role
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
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.startsWith(nameEQ)) {
      return c.substring(nameEQ.length);
    }
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Add role state
  const refreshUser = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const data = await getUser(token); // Pass token if needed
        if (data && data.success && data.user) {
          setUser(data.user);
          setRole(data.user.role);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        setUser(null);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const storedToken = getCookie("authToken");
    const storedRole = getCookie("userRole");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line
  }, [token]);
  const login = (newToken: string, userRole: string) => {
    setToken(newToken);
    setRole(userRole);
    setCookie("userRole", userRole);

    setCookie("authToken", newToken);
  };

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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
