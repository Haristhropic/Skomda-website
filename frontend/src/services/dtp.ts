import { INITIAL_DTP_ITEMS } from "@/data/initialDtp";
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

const LOCAL_STORAGE_KEY = "skomda_dtp_custom_data";

function getLocalStoredDtp(): DtpItem[] {
  if (typeof window === "undefined") return INITIAL_DTP_ITEMS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore error
  }
  return INITIAL_DTP_ITEMS;
}

function saveLocalStoredDtp(items: DtpItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore error
  }
}

export async function getDtpList(params?: { category?: string; q?: string }): Promise<DtpItem[]> {
  let result: DtpItem[] = [];

  // 1. Ambil dari backend API (otomatis memakai internal proxy /api/backend di browser atau direct backend di SSR)
  try {
    const url = buildApiUrl("dtp", {
      category: params?.category,
      q: params?.q,
    });
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        result = json.data;
        saveLocalStoredDtp(result);
      }
    }
  } catch {
    // Backend offline / error koneksi
  }

  // 2. Jika backend offline atau belum ada data di database, gunakan data tersimpan atau data resmi awal
  if (result.length === 0) {
    result = getLocalStoredDtp();
  }

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
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Ignore error
  }

  const list = getLocalStoredDtp();
  const found = list.find(
    (item) => String(item.id) === String(idOrSlug) || item.slug === String(idOrSlug)
  );
  return found || null;
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
    const currentList = getLocalStoredDtp();
    saveLocalStoredDtp([...currentList, savedItem]);
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
    const currentList = getLocalStoredDtp();
    const updatedList = currentList.map((item) =>
      String(item.id) === String(id) || item.slug === String(id)
        ? { ...item, ...updatedItem }
        : item
    );
    saveLocalStoredDtp(updatedList);
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

    const currentList = getLocalStoredDtp();
    const updatedList = currentList.filter(
      (item) => String(item.id) !== String(id) && item.slug !== String(id)
    );
    saveLocalStoredDtp(updatedList);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke server backend" };
  }
}
