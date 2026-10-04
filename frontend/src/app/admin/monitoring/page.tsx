"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, ExternalLink, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminApiUrl } from "@/services/adminApi";

interface MonitoringSnapshot {
  instance?: string;
  captured_at: string;
  uptime_seconds: number;
  requests: { total: number; errors: number; rate_per_second: number; p95_ms: number };
  services: { name: string; status: string; detail?: string }[];
  recent_requests: { timestamp: string; method: string; route: string; status: number; duration_ms: number; request_id: string }[];
  database: { open_connections: number; in_use: number; idle: number };
  redis: { enabled: boolean; status: string };
}

const number = (value?: number, digits = 0) => value === undefined ? "—" : value.toLocaleString("id-ID", { maximumFractionDigits: digits });

export default function MonitoringPage() {
  const { user } = useAdminAuth();
  const [snapshot, setSnapshot] = useState<MonitoringSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGrafana, setShowGrafana] = useState(false);
  const load = useCallback(async () => {
    if (user?.role !== "super_admin") return;
    setLoading(true);
    try {
      const response = await fetch(adminApiUrl("admin/monitoring"), {
        credentials: "include", cache: "no-store", signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) throw new Error(response.status === 403 ? "Akses khusus super admin." : "Ringkasan monitoring belum dapat dimuat.");
      setSnapshot(await response.json());
      setError("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Tidak dapat terhubung ke monitoring.");
    } finally { setLoading(false); }
  }, [user?.role]);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => { if (document.visibilityState === "visible") void load(); }, 30_000);
    return () => window.clearInterval(interval);
  }, [load]);

  return (
    <AdminLayout title="Monitoring Website" subtitle="Status layanan, traffic, dan permintaan terbaru." actions={
      <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50">
        <RefreshCw aria-hidden="true" className={`size-4 ${loading ? "animate-spin" : ""}`} /> Segarkan
      </button>
    }>
      <div className="space-y-8">
        <div aria-live="polite">
          {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error} Data terakhir, jika ada, tetap ditampilkan. Tekan Segarkan untuk mencoba lagi.</p>}
          <p className="text-sm text-slate-600">
            {snapshot ? `Diperbarui ${new Date(snapshot.captured_at).toLocaleString("id-ID")}. Instance ${snapshot.instance || "aktif"}.` : loading ? "Memuat status layanan…" : "Belum ada data monitoring."}
          </p>
          <p className="mt-1 text-xs text-slate-600">Ringkasan ini berasal dari satu replika backend: rate adalah rata-rata sejak proses dimulai, p95 dari maksimal 2.048 request terakhir. Grafana menampilkan gabungan replika dan riwayat traffic. Request bukan jumlah pengunjung unik.</p>
        </div>

        <section aria-labelledby="traffic-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 id="traffic-heading" className="text-lg font-semibold">Traffic & respons</h2>
          <dl className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              ["Total request", number(snapshot?.requests.total)],
              ["Error server (5xx)", number(snapshot?.requests.errors)],
              ["Request per detik", number(snapshot?.requests.rate_per_second, 2)],
              ["Latensi p95", `${number(snapshot?.requests.p95_ms, 1)} ms`],
            ].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-600">{label}</dt><dd className="mt-2 text-2xl font-semibold tabular-nums">{value}</dd></div>)}
          </dl>
        </section>

        <section aria-labelledby="services-heading">
          <h2 id="services-heading" className="text-lg font-semibold">Layanan & koneksi</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {(snapshot?.services || []).map((service) => <div key={service.name} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4 last:border-0">
              <div><h3 className="text-sm font-semibold">{service.name}</h3>{service.detail && <p className="mt-1 text-xs text-slate-600">{service.detail}</p>}</div>
              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${["ok", "healthy", "up"].includes(service.status) ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900"}`}>{service.status}</span>
            </div>)}
            {!snapshot?.services?.length && <p className="p-5 text-sm text-slate-600">Status layanan belum tersedia.</p>}
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-600 tabular-nums">Database: {number(snapshot?.database.open_connections)} koneksi terbuka · {number(snapshot?.database.in_use)} digunakan · {number(snapshot?.database.idle)} idle. Redis: {snapshot?.redis.status || "belum tersedia"}. Uptime: {number(snapshot ? snapshot.uptime_seconds / 60 : undefined)} menit.</p>
          </div>
        </section>

        <section aria-labelledby="grafana-heading" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 id="grafana-heading" className="text-lg font-semibold">Grafana</h2><p className="mt-1 text-sm text-slate-600">Traffic gabungan, latensi, error, CPU, memori, dan Redis. Akses dashboard hanya baca.</p></div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowGrafana(!showGrafana)} className="inline-flex items-center gap-2 rounded-lg bg-[#bc0c11] px-3 py-2 text-sm font-semibold text-white hover:bg-[#990a0e]"><Activity aria-hidden="true" className="size-4" />{showGrafana ? "Tutup dashboard" : "Tampilkan dashboard"}</button>
              <a href="/api/observability/grafana/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"><ExternalLink aria-hidden="true" className="size-4" />Buka penuh</a>
            </div>
          </div>
          {showGrafana && <iframe title="Grafana monitoring SKOMDA" src="/api/observability/grafana/" className="h-[650px] w-full rounded-xl border border-slate-200 bg-white" loading="lazy" referrerPolicy="same-origin" />}
        </section>

        <section aria-labelledby="requests-heading">
          <h2 id="requests-heading" className="text-lg font-semibold">Log permintaan terbaru</h2>
          <p className="mt-1 text-sm text-slate-600">Log dibatasi dan tidak memuat isi formulir, IP, token, atau query URL.</p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600"><tr>{["Waktu", "Metode / route", "Status", "Durasi", "Request ID"].map((label) => <th key={label} scope="col" className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">{(snapshot?.recent_requests || []).map((request, index) => <tr key={`${request.request_id}-${index}`}>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums">{new Date(request.timestamp).toLocaleTimeString("id-ID")}</td>
                <td className="px-4 py-3"><span className="mr-2 text-xs font-semibold">{request.method}</span>{request.route}</td>
                <td className={`px-4 py-3 tabular-nums ${request.status >= 500 ? "text-red-700" : "text-slate-800"}`}>{request.status}</td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums">{number(request.duration_ms, 1)} ms</td>
                <td className="max-w-44 truncate px-4 py-3 font-mono text-xs" title={request.request_id}>{request.request_id || "—"}</td>
              </tr>)}{!snapshot?.recent_requests?.length && <tr><td colSpan={5} className="px-4 py-6 text-slate-600">Belum ada log permintaan untuk instance ini.</td></tr>}</tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
