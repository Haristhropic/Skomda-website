import { adminApiUrl } from "@/services/adminApi";
import { buildApiUrl } from "@/lib/api";

export interface DtpItem {
  id?: number | string;
  slug: string;
  number: string;
  title: string;
  category: "Software & AI" | "Network & Cloud" | "Hardware & Security" | "Design & Creative" | string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  coreSkills: string; // Comma-separated string
  supportingSkills?: string;
  careerProspects?: string;
  tools?: string;
  badgeText?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export async function getDtpList(params?: { category?: string; q?: string }): Promise<DtpItem[]> {
  let result: DtpItem[] = [];
  let loaded = false;

  // 1. Ambil dari backend API (otomatis memakai internal proxy /api/backend di browser atau direct backend di SSR)
  try {
    const url = buildApiUrl("dtp", {
      category: params?.category,
      q: params?.q,
    });
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        loaded = true;
        result = json.data;
      }
    }
  } catch {
    // Backend offline / error koneksi
  }

  // A successful empty list is authoritative: deleted content must stay deleted.
  // Offline data must not be presented as live content or editable DB records.
  if (!loaded) throw new Error("Daftar program DTP tidak dapat dimuat dari server.");

  // 3. Filter client-side jika menggunakan data fallback
  if (params?.category && params.category !== "Semua") {
    result = result.filter(
      (item) => item.category.toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params?.q) {
    const q = params.q.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        (item.coreSkills && item.coreSkills.toLowerCase().includes(q)) ||
        (item.tools && item.tools.toLowerCase().includes(q))
    );
  }

  return result.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
}

export async function getDtpById(idOrSlug: string | number): Promise<DtpItem | null> {
  try {
    const url = buildApiUrl(`dtp/${idOrSlug}`);
    const res = await fetch(url, { cache: "no-store" });
    if (res.status === 404) return null;
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Ignore error
  }

  throw new Error("Detail program DTP tidak dapat dimuat dari server.");
}

export async function getAdminDtpList(): Promise<DtpItem[]> {
  const response = await fetch(adminApiUrl("admin/dtp"), { cache: "no-store", credentials: "include", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error("Daftar DTP admin tidak dapat dimuat.");
  const result = await response.json();
  if (!Array.isArray(result.data)) throw new Error("Respons DTP admin tidak valid.");
  return result.data;
}

export async function createDtp(
  data: Partial<DtpItem>
): Promise<{ success: boolean; data?: DtpItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("dtp"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal menambahkan program DTP ke database" };
    }

    const savedItem: DtpItem = json.data || data;
    return { success: true, data: savedItem };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke server backend" };
  }
}

export async function updateDtp(
  id: number | string,
  data: Partial<DtpItem>
): Promise<{ success: boolean; data?: DtpItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`dtp/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal memperbarui program DTP di database" };
    }

    const updatedItem: DtpItem = json.data || { ...data, id };
    return { success: true, data: updatedItem };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke server backend" };
  }
}

export async function deleteDtp(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`dtp/${id}`), {
      method: "DELETE",
      credentials: "include",
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal menghapus program DTP dari database" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke server backend" };
  }
}
