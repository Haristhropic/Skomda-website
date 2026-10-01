import { INITIAL_DTP_ITEMS } from "@/data/initialDtp";

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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

  // 1. Coba ambil dari backend API
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "Semua") query.set("category", params.category);
    if (params?.q) query.set("q", params.q);

    const qs = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_BASE_URL}/dtp${qs}`, { cache: "no-store" });
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
    const res = await fetch(`${API_BASE_URL}/dtp/${idOrSlug}`, { cache: "no-store" });
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
  // Update local storage agar perubahan admin langsung terlihat seketika
  const currentList = getLocalStoredDtp();
  const nextId =
    currentList.length > 0
      ? Math.max(...currentList.map((i) => (typeof i.id === "number" ? i.id : 0))) + 1
      : 1;

  const newItem: DtpItem = {
    id: nextId,
    slug: data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `dtp-${nextId}`,
    number: data.number || String(nextId).padStart(2, "0"),
    title: data.title || "Spesialisasi Baru",
    category: data.category || "Software & AI",
    image: data.image || "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-1.png",
    shortDesc: data.shortDesc || "",
    fullDesc: data.fullDesc || "",
    coreSkills: data.coreSkills || "",
    supportingSkills: data.supportingSkills || "",
    careerProspects: data.careerProspects || "",
    tools: data.tools || "",
    badgeText: data.badgeText || "Track Baru",
    orderIndex: data.orderIndex || currentList.length + 1,
    isActive: data.isActive !== undefined ? data.isActive : true,
  };

  const updatedList = [...currentList, newItem];
  saveLocalStoredDtp(updatedList);

  // Coba sinkronkan ke backend API jika online
  try {
    const res = await fetch(`${API_BASE_URL}/dtp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return { success: true, data: json.data };
      }
    }
  } catch {
    // Backend offline, tetap sukses menyimpan di local persistence
  }

  return { success: true, data: newItem };
}

export async function updateDtp(
  id: number | string,
  data: Partial<DtpItem>
): Promise<{ success: boolean; data?: DtpItem; error?: string }> {
  const currentList = getLocalStoredDtp();
  let updatedItem: DtpItem | undefined;

  const updatedList = currentList.map((item) => {
    if (String(item.id) === String(id) || item.slug === String(id)) {
      updatedItem = { ...item, ...data };
      return updatedItem;
    }
    return item;
  });

  if (updatedItem) {
    saveLocalStoredDtp(updatedList);
  }

  // Coba sinkronkan ke backend API jika online
  try {
    const res = await fetch(`${API_BASE_URL}/dtp/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return { success: true, data: json.data };
      }
    }
  } catch {
    // Backend offline, tetap sukses dengan local persistence
  }

  return { success: true, data: updatedItem };
}

export async function deleteDtp(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  const currentList = getLocalStoredDtp();
  const updatedList = currentList.filter(
    (item) => String(item.id) !== String(id) && item.slug !== String(id)
  );
  saveLocalStoredDtp(updatedList);

  // Coba sinkronkan ke backend API jika online
  try {
    await fetch(`${API_BASE_URL}/dtp/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // Backend offline
  }

  return { success: true };
}
