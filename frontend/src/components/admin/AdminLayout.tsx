"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { SECRET_ADMIN_LOGIN_PATH } from "@/config/adminPath";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: AdminLayoutProps) {
  const { isAuthenticated, isLoading, user } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const technicalPage = pathname === "/admin/monitoring" || pathname.startsWith("/admin/monitoring/") || pathname === "/admin/audit-logs" || pathname === "/admin/users";
  const wrongPanel = !!user && (user.role === "super_admin" ? !technicalPage : technicalPage);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(SECRET_ADMIN_LOGIN_PATH);
    } else if (!isLoading && wrongPanel) {
      router.replace(user?.role === "super_admin" ? "/admin/monitoring" : "/admin");
    }
  }, [isLoading, isAuthenticated, wrongPanel, user?.role, router]);

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-white p-3 shadow-lg border border-slate-100 animate-pulse">
            <Image
              src="/images/common/telkom-schools-icon.png"
              alt="Logo Telkom Schools"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Memverifikasi Sesi Admin
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Menghubungkan ke layanan otentikasi SKOMDA...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated state (redirecting)
  if (!isAuthenticated || wrongPanel) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container (Shifted right by 72 on desktop) */}
      <div className="flex flex-1 flex-col lg:pl-72 min-h-screen">
        {/* Header */}
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          actions={actions}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
