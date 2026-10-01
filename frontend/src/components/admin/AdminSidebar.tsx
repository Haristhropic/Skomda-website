"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  GraduationCap,
  Users,
  Trophy,
  Briefcase,
  Activity,
  Building2,
  FileText,
  Settings,
  ShieldCheck,
  ExternalLink,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  role?: "super_admin";
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Utama",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "Berita & Artikel", href: "/admin/berita", icon: Newspaper },
    ],
  },
  {
    group: "Akademik & Siswa",
    items: [
      { title: "Digital Talent (DTP)", href: "/admin/dtp", icon: Sparkles },
      { title: "Kelulusan & Alumni", href: "/admin/kelulusan", icon: GraduationCap },
      { title: "Guru & Tenaga Kependidikan", href: "/admin/guru", icon: Users },
      { title: "Prestasi Siswa", href: "/admin/prestasi", icon: Trophy },
      { title: "Bursa Kerja & BKK", href: "/admin/bkk", icon: Briefcase },
    ],
  },
  {
    group: "Kesiswaan & Sarana",
    items: [
      { title: "Ekstrakurikuler", href: "/admin/ekskul", icon: Activity },
      { title: "Fasilitas", href: "/admin/fasilitas", icon: Building2 },
      { title: "Dokumen & Regulasi", href: "/admin/dokumen", icon: FileText },
    ],
  },
  {
    group: "Sistem & Pengaturan",
    items: [
      { title: "Pengaturan Website", href: "/admin/pengaturan", icon: Settings },
      {
        title: "Log Aktivitas",
        href: "/admin/audit-logs",
        icon: ShieldCheck,
        role: "super_admin",
      },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Tutup Menu Navigasi"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") onClose();
          }}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="relative flex size-9 shrink-0 items-center justify-center">
              <Image
                src="/images/common/telkom-schools-icon.png"
                alt="Logo Telkom Schools"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="block font-poppins text-sm font-bold tracking-tight text-slate-900">
                SKOMDA <span className="text-[#bc0c11]">Admin</span>
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Sidebar"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Menus with Scroll */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5 admin-modal-scrollbar">
          {NAV_GROUPS.map((group) => {
            // Saring item berdasarkan role jika diperlukan
            const visibleItems = group.items.filter(
              (item) => !item.role || (user && user.role === item.role)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group} className="space-y-1">
                <h2 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {group.group}
                </h2>
                <div className="space-y-0.5 pt-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-[#bc0c11] text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <Icon
                          className={`size-4.5 shrink-0 transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-slate-700"
                          }`}
                        />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer Area: User Profile & Public Site Link */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/70 p-4 space-y-3">
          {/* External link to website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-[#bc0c11] transition-colors"
          >
            <ExternalLink className="size-3.5 text-slate-400" />
            <span>Website Publik</span>
          </Link>

          {/* User profile card */}
          {user && (
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-[#bc0c11] text-xs border border-red-200">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {user.name}
                  </p>
                  <p className="truncate text-[10px] font-medium text-slate-500 capitalize">
                    {user.role === "super_admin" ? "Super Admin" : "Editor Konten"}
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={logout}
                title="Keluar dari Panel Admin"
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
