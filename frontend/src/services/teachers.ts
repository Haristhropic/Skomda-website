import { adminApiUrl } from "@/services/adminApi";
import { buildApiUrl } from "@/lib/api";

export interface TeacherItem {
  id?: number | string;
  name: string;
  role: string;
  category: string;
  image?: string;
  bio?: string;
  pendidikanTerakhir?: string;
  bidangKeahlian?: string;
  motto?: string;
  kontak?: string;
  orderIndex?: number;
  created_at?: string;
}

export const TEACHER_CATEGORIES = [
  "Semua",
  "Kepala Sekolah",
  "Manajemen",
  "Guru",
  "Guru SIJA",
  "Guru TJAT",
  "Staf",
] as const;

export async function getTeachers(category?: string): Promise<TeacherItem[]> {
  try {
    const url = buildApiUrl("teachers", { category });
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((t: TeacherItem) => ({
          ...t,
          image: t.image ? t.image.replace(/(\/profil-guru\/[^/]+)/g, (match) => match.replace(/\s+/g, "-")) : t.image,
        }));
      }
    }
    return [];
  } catch {
    return [];
  }
}

export async function createTeacher(
  data: Partial<TeacherItem>
): Promise<{ success: boolean; data?: TeacherItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("teachers"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menyimpan guru" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function updateTeacher(
  id: number | string,
  data: Partial<TeacherItem>
): Promise<{ success: boolean; data?: TeacherItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`teachers/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui guru" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function deleteTeacher(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`teachers/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menghapus guru" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}
