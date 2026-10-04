import { adminApiUrl } from "@/services/adminApi";
import { buildApiUrl } from "@/lib/api";

export interface AlumniItem {
  id?: number;
  nisn?: string;
  name: string;
  angkatan: string;
  tahunLulus: string;
  tahunAjaran: string;
  statusKelulusan: string;
  kategori: string;
  statusAktivitas: string;
  keterangan: string;
  institusi?: string;
  jurusan?: string;
  created_at?: string;
}

export const ALUMNI_CATEGORIES = [
  "Semua",
  "Melanjutkan Studi",
  "Bekerja",
  "Wirausaha",
  "Mencari Kerja",
  "Alumni",
] as const;

export async function getAlumniList(params?: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: AlumniItem[]; total: number }> {
  try {
    const url = buildApiUrl("alumni", {
      category: params?.category,
      q: params?.q,
      limit: params?.limit,
      offset: params?.offset,
    });

    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return { data: Array.isArray(json.data) ? json.data : [], total: json.total || 0 };
    }
  } catch {
    // Do not ship the private alumni dataset as a public fallback.
  }
  return { data: [], total: 0 };
}

export async function getAdminAlumniList(params?: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: AlumniItem[]; total: number }> {
  const url = new URL(adminApiUrl("admin/alumni"), window.location.origin);
  if (params?.category && params.category !== "Semua") url.searchParams.set("category", params.category);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.offset) url.searchParams.set("offset", String(params.offset));

  const res = await fetch(url.toString(), { credentials: "include", cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal memuat data kelulusan");
  return { data: Array.isArray(json.data) ? json.data : [], total: json.total || 0 };
}

export async function createAlumni(
  data: Partial<AlumniItem>
): Promise<{ success: boolean; data?: AlumniItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("alumni"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal menambahkan data kelulusan siswa" };
    }
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend" };
  }
}

export async function updateAlumni(
  id: number | string,
  data: Partial<AlumniItem>
): Promise<{ success: boolean; data?: AlumniItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`alumni/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal memperbarui data siswa" };
    }
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend" };
  }
}

export async function deleteAlumni(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`alumni/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const json = await res.json();
      return { success: false, error: json.error || "Gagal menghapus data siswa" };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Gagal terhubung ke server backend" };
  }
}
