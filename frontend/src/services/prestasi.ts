import { adminApiUrl } from "@/services/adminApi";
import { buildApiUrl } from "@/lib/api";

export interface PrestasiItem {
  id?: number | string;
  slug?: string;
  title: string;
  category: "IT & AI" | "Olahraga" | "Seni & Kreatif" | "Kepemimpinan" | string;
  award: string;
  badgeLevel: string;
  competition: string;
  organizer: string;
  year: string;
  studentName: string;
  studentClass: string;
  image?: string;
  description?: string;
  created_at?: string;
}

export const PRESTASI_CATEGORIES = [
  "Semua",
  "IT & AI",
  "Olahraga",
  "Seni & Kreatif",
  "Kepemimpinan",
] as const;

export async function getPrestasiList(
  category?: string,
  year?: string
): Promise<PrestasiItem[]> {
  try {
    const url = buildApiUrl("prestasi", { category, year });
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function createPrestasi(
  data: Partial<PrestasiItem>
): Promise<{ success: boolean; data?: PrestasiItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("prestasi"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menyimpan prestasi" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function updatePrestasi(
  id: number | string,
  data: Partial<PrestasiItem>
): Promise<{ success: boolean; data?: PrestasiItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`prestasi/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui prestasi" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function deletePrestasi(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`prestasi/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menghapus prestasi" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}
