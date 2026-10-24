import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthUser, LoginCredentials, UserRole } from "../types/auth";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("chickie_crm_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chickie_crm_user");
      if (stored) return false;
    }
    return true;
  });

  // Thử khôi phục hoặc làm mới phiên ngầm khi tải trang
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        await authService.refreshToken();
        const profile = await authService.getProfile();
        if (isMounted && profile.user) {
          setUser(profile.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("chickie_crm_user", JSON.stringify(profile.user));
          }
        }
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        const isSessionExpired = status === 401 || (err as Error)?.message === "SESSION_EXPIRED";
        if (isMounted && isSessionExpired) {
          setUser(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("chickie_crm_user");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("chickie_crm_user", JSON.stringify(data.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("chickie_crm_user");
      }
      setIsLoading(false);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
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
