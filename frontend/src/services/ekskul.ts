import { adminApiUrl } from "@/services/adminApi";

export interface EkskulItem {
  id?: number | string;
  name: string;
  slug?: string;
  category: string;
  pembina?: string;
  schedule?: string;
  description?: string;
  image?: string;
  badgeColor?: string;
  orderIndex?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getEkskulList(): Promise<EkskulItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/ekskul`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function createEkskul(
  data: Partial<EkskulItem>
): Promise<{ success: boolean; data?: EkskulItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("ekskul"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal membuat ekstrakurikuler" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function updateEkskul(
  id: number | string,
  data: Partial<EkskulItem>
): Promise<{ success: boolean; data?: EkskulItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`ekskul/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui ekstrakurikuler" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function deleteEkskul(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`ekskul/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menghapus ekstrakurikuler" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}
