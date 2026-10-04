"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SECRET_ADMIN_LOGIN_PATH } from "@/config/adminPath";
import { adminApiUrl } from "@/services/adminApi";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "editor";
  avatar?: string;
  created_at?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(adminApiUrl("auth/me"), {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.user) {
          setUser(json.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only check admin authentication if accessing internal admin routes
    if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/gate-internal-skomda"))) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [pathname, refreshUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(adminApiUrl("auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: json.error || "Email atau kata sandi tidak valid.",
        };
      }

      if (json.user) {
        setUser(json.user);
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: "Gagal terhubung ke server autentikasi backend.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch(adminApiUrl("auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      router.push(SECRET_ADMIN_LOGIN_PATH);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth harus digunakan di dalam AdminAuthProvider");
  }
  return context;
}
