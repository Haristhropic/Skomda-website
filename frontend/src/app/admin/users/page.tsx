"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth, type AdminUser } from "@/context/AdminAuthContext";
import { useLanguage, type LocaleData } from "@/context/LanguageContext";
import { adminApiUrl } from "@/services/adminApi";

export default function AdminUsersPage() {
  const { user } = useAdminAuth();
  const { t } = useLanguage();
  const text = useCallback((key: keyof LocaleData["adminOperations"]) => t(`adminOperations.${key}`), [t]);
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
      if (!response.ok) throw new Error("accounts-unavailable");
      const json = await response.json();
      setUsers(Array.isArray(json.data) ? json.data : []);
      setError("");
    } catch { setError(text("theAccountListCouldNotBe")); }
    finally { setLoading(false); }
  }, [user?.role, text]);
  useEffect(() => { void load(); }, [load]);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const password = String(values.get("password") || "");
    if (new TextEncoder().encode(password).length > 72) { setError(text("passwordsMustNotExceed72Bytes")); return; }
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch(adminApiUrl("admin/users"), {
        method: "POST", credentials: "include", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: values.get("name"), email: values.get("email"), password, role: "editor" }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(response.status === 409 ? text("thisEmailIsAlreadyUsedBy") : text("theEditorAccountCouldNotBe"));
      form.reset(); setMessage(text("editorAccountCreatedShareTheCredentials"));
      await load();
    } catch (failure) { setError(failure instanceof Error ? failure.message : text("theEditorAccountCouldNotBe2")); }
    finally { setSaving(false); }
  }

  return <AdminLayout title={text("editorAccounts")} subtitle={text("superAdminsProvideEditorAccessEditors")} actions={<button type="button" onClick={() => void load()} disabled={loading} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50">{text("refresh")}</button>}>
    <div className="space-y-8">
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="create-editor">
        <h2 id="create-editor" className="text-lg font-semibold">{text("addEditor")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{text("thisAccountCanManageContentAnd")}</p>
        <form onSubmit={create} aria-busy={saving} className="mt-5 grid max-w-2xl gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">{text("name")}<input name="name" autoComplete="name" required maxLength={100} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" /></label>
          <label className="text-sm font-semibold">Email<input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" /></label>
          <label className="text-sm font-semibold sm:col-span-2">{text("newPassword")}<input name="password" type="password" autoComplete="new-password" required minLength={16} maxLength={72} aria-describedby="password-note" className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" /><span id="password-note" className="mt-2 block text-xs font-normal text-slate-600">{text("useAUniquePasswordWithAt")}</span></label>
          <button type="submit" disabled={saving} className="justify-self-start rounded-lg bg-[#bc0c11] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#990a0e] disabled:opacity-50">{saving ? text("creatingAccount") : text("createEditorAccount")}</button>
          <span className="sr-only" role="status">{saving ? text("creatingEditorAccount") : ""}</span>
        </form>
      </section>
      <section aria-labelledby="accounts-list" aria-busy={loading}>
        <h2 id="accounts-list" className="text-lg font-semibold">{text("registeredAccounts")}</h2>
        <span className="sr-only" role="status">{loading ? text("loadingAccounts") : ""}</span>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr>{[text("name"), "Email", text("role")].map((label) => <th key={label} scope="col" className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{users.map((account) => <tr key={account.id}><td className="px-4 py-3">{account.name}</td><td className="px-4 py-3">{account.email}</td><td className="px-4 py-3">{account.role === "super_admin" ? text("superAdminOperations") : text("editorContent")}</td></tr>)}{!users.length && <tr><td colSpan={3} className="px-4 py-6 text-slate-600">{loading ? text("loadingAccounts") : text("noAccountDataYet")}</td></tr>}</tbody></table></div>
      </section>
    </div>
  </AdminLayout>;
}
