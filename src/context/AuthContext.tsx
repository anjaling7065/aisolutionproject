import { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  company?: string;
  avatar?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string, company?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { fullName?: string; company?: string; email?: string; avatar?: string; password?: string }) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-login on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("stellar_token");
      const storedUser = localStorage.getItem("stellar_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Fetch fresh profile from API to verify token validity
        try {
          const res = await fetch("/api/profile", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem("stellar_user", JSON.stringify(data));
          } else {
            // Token expired or invalid
            localStorage.removeItem("stellar_token");
            localStorage.removeItem("stellar_user");
            setToken(null);
            setUser(null);
          }
        } catch (e) {
          console.error("Failed to auto-verify profile:", e);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to log in.");
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("stellar_token", data.token);
      localStorage.setItem("stellar_user", JSON.stringify(data.user));
      return true;
    } catch (err: any) {
      console.error("Login Context Error:", err);
      setError("Server connection failure.");
      return false;
    }
  };

  const register = async (fullName: string, email: string, password: string, company?: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, company }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register account.");
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("stellar_token", data.token);
      localStorage.setItem("stellar_user", JSON.stringify(data.user));
      return true;
    } catch (err: any) {
      console.error("Register Context Error:", err);
      setError("Server connection failure.");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("stellar_token");
    localStorage.removeItem("stellar_user");
    // Also clear optional temporary items
  };

  const updateProfile = async (data: { fullName?: string; company?: string; email?: string; avatar?: string; password?: string }): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const updatedUser = await res.json();

      if (!res.ok) {
        setError(updatedUser.error || "Failed to update profile.");
        return false;
      }

      setUser(updatedUser);
      localStorage.setItem("stellar_user", JSON.stringify(updatedUser));
      return true;
    } catch (err: any) {
      console.error("Update Profile Context Error:", err);
      setError("Server connection failure.");
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updateProfile, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
