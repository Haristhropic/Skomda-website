import { adminApiUrl } from "@/services/adminApi";
import { buildApiUrl } from "@/lib/api";

export interface FasilitasItem {
  id?: number | string;
  name: string;
  category: string;
  image: string;
  description?: string;
  capacity?: string;
  features?: string;
  orderIndex?: number;
}

export async function getFasilitasList(): Promise<FasilitasItem[]> {
  try {
    const res = await fetch(buildApiUrl("fasilitas"), { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function createFasilitas(
  data: Partial<FasilitasItem>
): Promise<{ success: boolean; data?: FasilitasItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("fasilitas"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal membuat fasilitas" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function updateFasilitas(
  id: number | string,
  data: Partial<FasilitasItem>
): Promise<{ success: boolean; data?: FasilitasItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`fasilitas/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui fasilitas" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function deleteFasilitas(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`fasilitas/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menghapus fasilitas" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}
