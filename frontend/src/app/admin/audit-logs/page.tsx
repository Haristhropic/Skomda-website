"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, AlertTriangle, Shield } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminApiUrl } from "@/services/adminApi";

interface AuditLogItem {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  entity: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const { user } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${adminApiUrl("admin/audit-logs")}?limit=50`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setLogs(json.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat audit log:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "super_admin") {
      loadLogs();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (user?.role !== "super_admin") {
    return (
      <AdminLayout
        title="Log Aktivitas"
        subtitle="Riwayat audit mutasi data panel admin"
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center max-w-xl mx-auto my-12">
          <AlertTriangle className="mx-auto size-12 text-amber-600" />
          <h2 className="mt-3 text-base font-bold text-amber-900 font-poppins">
            Akses Khusus Super Admin
          </h2>
          <p className="mt-2 text-xs text-amber-700 leading-relaxed">
            Halaman log aktivitas dan audit sistem ini hanya dapat diakses oleh akun dengan peran Super Admin untuk menjaga kepatuhan dan integritas data sekolah.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Log Aktivitas & Audit Keamanan"
      subtitle="Pencatatan riwayat setiap aksi mutasi data dan otentikasi di panel admin"
      actions={
        <button
          type="button"
          onClick={loadLogs}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Segarkan Log</span>
        </button>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            <ShieldCheck className="mx-auto size-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              Belum ada riwayat aktivitas tercatat
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Setiap aktivitas login dan pengubahan data akan otomatis dicatat di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 pl-6 pr-3">Waktu & Tanggal</th>
                  <th className="px-3 py-3.5">Pengguna</th>
                  <th className="px-3 py-3.5">Aksi</th>
                  <th className="px-3 py-3.5">Modul</th>
                  <th className="px-3 py-3.5">Keterangan Aktivitas</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const dateStr = log.created_at
                    ? new Date(log.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "-";

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pl-6 pr-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {dateStr}
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap font-bold text-slate-900">
                        {log.user_name || `User #${log.user_id}`}
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            log.action === "CREATE"
                              ? "bg-emerald-100 text-emerald-800"
                              : log.action === "UPDATE"
                              ? "bg-blue-100 text-blue-800"
                              : log.action === "DELETE"
                              ? "bg-red-100 text-red-800"
                              : log.action === "LOGIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                          {log.entity}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-700 font-medium max-w-xs truncate">
                        {log.details || "-"}
                      </td>
                      <td className="py-3.5 pl-3 pr-6 whitespace-nowrap text-right font-mono text-[11px] text-slate-400">
                        {log.ip_address || "127.0.0.1"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
