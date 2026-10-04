"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth, type AdminUser } from "@/context/AdminAuthContext";
import { adminApiUrl } from "@/services/adminApi";

export default function AdminUsersPage() {
  const { user } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (user?.role !== "super_admin") return;
    setLoading(true);
    try {
      const response = await fetch(adminApiUrl("admin/users"), { credentials: "include", cache: "no-store", signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new Error("Daftar akun tidak dapat dimuat.");
      const json = await response.json();
      setUsers(Array.isArray(json.data) ? json.data : []);
    } catch { setError("Daftar akun tidak dapat dimuat. Tekan Segarkan untuk mencoba lagi."); }
    finally { setLoading(false); }
  }, [user?.role]);
  useEffect(() => { void load(); }, [load]);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const password = String(values.get("password") || "");
    if (new TextEncoder().encode(password).length > 72) { setError("Kata sandi maksimal 72 byte."); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch(adminApiUrl("admin/users"), {
        method: "POST", credentials: "include", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: values.get("name"), email: values.get("email"), password, role: "editor" }),
        signal: AbortSignal.timeout(15_000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Akun editor gagal dibuat.");
      form.reset(); setMessage("Akun editor berhasil dibuat. Kirim kredensial melalui saluran pribadi.");
      await load();
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Akun editor gagal dibuat."); }
    finally { setSaving(false); }
  }

  return <AdminLayout title="Akun Editor" subtitle="Super admin menyediakan akses editor; editor mengelola konten website." actions={<button type="button" onClick={() => void load()} disabled={loading} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50">Segarkan</button>}>
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="create-editor">
        <h2 id="create-editor" className="text-lg font-semibold">Tambah editor</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">Akun ini mendapat akses CRUD konten dan pendaftar. Monitoring teknis, log keamanan, dan penyediaan akun tetap khusus super admin.</p>
        <form onSubmit={create} className="mt-5 grid max-w-2xl gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Nama<input name="name" autoComplete="name" required maxLength={100} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" /></label>
          <label className="text-sm font-semibold">Email<input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" /></label>
          <label className="text-sm font-semibold sm:col-span-2">Kata sandi baru<input name="password" type="password" autoComplete="new-password" required minLength={16} maxLength={72} aria-describedby="password-note" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" /><span id="password-note" className="mt-2 block text-xs font-normal text-slate-600">Gunakan kata sandi unik minimal 16 karakter dan maksimal 72 byte. Kata sandi tidak ditampilkan dalam log.</span></label>
          <button type="submit" disabled={saving} className="justify-self-start rounded-lg bg-[#bc0c11] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#990a0e] disabled:opacity-50">{saving ? "Membuat akun…" : "Buat akun editor"}</button>
        </form>
      </section>
      <section aria-labelledby="accounts-list">
        <h2 id="accounts-list" className="text-lg font-semibold">Akun terdaftar</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr>{["Nama", "Email", "Peran"].map((label) => <th key={label} scope="col" className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{users.map((account) => <tr key={account.id}><td className="px-4 py-3">{account.name}</td><td className="px-4 py-3">{account.email}</td><td className="px-4 py-3">{account.role === "super_admin" ? "Super admin · operasional" : "Editor · konten"}</td></tr>)}{!users.length && <tr><td colSpan={3} className="px-4 py-6 text-slate-600">{loading ? "Memuat akun…" : "Belum ada data akun."}</td></tr>}</tbody></table></div>
      </section>
    </div>
  </AdminLayout>;
}
