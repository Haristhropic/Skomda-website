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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getTeachers(category?: string): Promise<TeacherItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/teachers`);
    if (category && category !== "Semua") {
      url.searchParams.set("category", category);
    }
    const res = await fetch(url.toString(), { cache: "no-store" });
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
    const res = await fetch(`${API_BASE_URL}/teachers`, {
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
    const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
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
    const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
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
