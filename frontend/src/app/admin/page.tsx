"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Newspaper,
  GraduationCap,
  Trophy,
  FileText,
  PlusCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalUsers: number;
  totalTeachers?: number;
  totalPrestasi?: number;
  totalEkskul?: number;
  totalFasilitas?: number;
  totalJobs?: number;
  totalPartners?: number;
  totalDocuments?: number;
  totalDtp?: number;
  recentLogs: Array<{
    id: number;
    user_name: string;
    action: string;
    entity: string;
    details: string;
    created_at: string;
  }>;
  recentNews: Array<{
    id: number;
    title: string;
    category: string;
    status: string;
    dateFormatted: string;
    author: string;
  }>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.warn("Statistik dashboard menggunakan data cadangan:", (err as Error)?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout
      title="Pusat Kendali Admin"
      subtitle={`Selamat bertugas, ${user?.name || "Administrator"}. Kelola seluruh konten situs dari panel ini.`}
      actions={
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 rounded-xl bg-[#bc0c11] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#990a0e] hover:shadow-md active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
        >
          <PlusCircle className="size-4" />
          <span>Tulis Berita Baru</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Berita */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Berita & Artikel</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Newspaper className="size-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900 font-poppins">
                {stats?.totalNews ?? 12}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {stats?.publishedNews ?? 12} Terbit, {stats?.draftNews ?? 0} Draf
              </p>
            </div>
          </div>

          {/* Card 2: Guru & Staf */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Guru & Tenaga Kependidikan</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <GraduationCap className="size-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900 font-poppins">
                {stats?.totalTeachers ?? 53}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Pendidik & Staf Terdaftar
              </p>
            </div>
          </div>

          {/* Card 3: Prestasi Siswa */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Prestasi Siswa</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Trophy className="size-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900 font-poppins">
                {stats?.totalPrestasi ?? 11}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Penghargaan Terverifikasi
              </p>
            </div>
          </div>

          {/* Card 4: Dokumen & Regulasi */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Dokumen & Regulasi</p>
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <FileText className="size-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-slate-900 font-poppins">
                {stats?.totalDocuments ?? 41}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Arsip Terbit & SOP Resmi
              </p>
            </div>
          </div>
        </div>

        {/* Quick Shortcut Panels */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/berita"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Newspaper className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Kelola Berita</p>
                <p className="text-xs text-slate-500">Tambah, edit, publikasi</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>

          <Link
            href="/admin/dtp"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-[#bc0c11]">
                <Sparkles className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Digital Talent</p>
                <p className="text-xs text-slate-500">{stats?.totalDtp ?? 9} Spesialisasi DTP</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>

          <Link
            href="/admin/guru"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <GraduationCap className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Profil Guru</p>
                <p className="text-xs text-slate-500">Manajemen staf & jabatan</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <ExternalLink className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Website Publik</p>
                <p className="text-xs text-slate-500">Buka portal utama</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>
        </div>

        {/* Content Section: Recent News & Activity Logs */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Latest News (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Publikasi Berita Terbaru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar artikel yang baru diterbitkan atau diperbarui
                </p>
              </div>
              <Link
                href="/admin/berita"
                className="text-xs font-bold text-[#bc0c11] hover:underline"
              >
                Lihat Semua Berita
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : stats?.recentNews && stats.recentNews.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {stats.recentNews.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span className="text-[11px] font-medium text-slate-600">
                          {item.category}
                        </span>
                        <span>•</span>
                        <span>{item.dateFormatted}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "draft"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {item.status === "draft" ? "Draf" : "Terbit"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Belum ada data berita yang tercatat.
              </div>
            )}
          </div>

          {/* Right: Recent Audit Logs (1 Col) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Riwayat Aktivitas
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit log perubahan data
                </p>
              </div>
              <Shield className="size-4 text-slate-400" />
            </div>

            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : stats?.recentLogs && stats.recentLogs.length > 0 ? (
              <div className="space-y-3.5">
                {stats.recentLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <span
                      className={`mt-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        log.action === "CREATE"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.action === "UPDATE"
                          ? "bg-blue-100 text-blue-800"
                          : log.action === "DELETE"
                          ? "bg-red-100 text-red-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {log.action}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-800">
                        {log.details || `${log.action} ${log.entity}`}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Oleh {log.user_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Belum ada aktivitas tercatat.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
