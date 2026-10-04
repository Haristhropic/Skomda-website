import { adminApiUrl } from "@/services/adminApi";
import { buildApiUrl } from "@/lib/api";

export interface BKKJobItem {
  id?: number | string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  deadline?: string;
  salary?: string;
  requirements?: string;
  description?: string;
  companyLogo?: string;
  applyUrl?: string;
  status?: string; // 'active', 'pending', 'rejected', 'closed'
  contactPerson?: string;
  emailOrWa?: string;
  jurusan?: string;
  source?: string; // 'admin' | 'mitra'
  created_at?: string;
}

export interface BKKPartnerItem {
  id?: number | string;
  name: string;
  category: string;
  logo: string;
  description?: string;
  website?: string;
  orderIndex?: number;
}

export async function getBKKJobs(status?: string): Promise<BKKJobItem[]> {
  try {
    const url = buildApiUrl("bkk/jobs", { status });
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

export async function getAdminBKKJobs(): Promise<BKKJobItem[]> {
  const res = await fetch(adminApiUrl("admin/bkk/jobs"), {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(res.status === 401
      ? "Sesi admin berakhir. Silakan login kembali."
      : "Gagal memuat daftar lowongan admin.");
  }

  const json = await res.json();
  if (!Array.isArray(json.data)) throw new Error("Respons daftar lowongan admin tidak valid.");
  return json.data;
}

export async function createBKKJob(
  data: Partial<BKKJobItem>
): Promise<{ success: boolean; data?: BKKJobItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("bkk/jobs"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal membuat lowongan" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function updateBKKJob(
  id: number | string,
  data: Partial<BKKJobItem>
): Promise<{ success: boolean; data?: BKKJobItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`bkk/jobs/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui lowongan" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function deleteBKKJob(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`bkk/jobs/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menghapus lowongan" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

/**
 * Public function: Pengajuan lowongan oleh mitra / publik.
 * Status otomatis 'pending' agar diverifikasi admin terlebih dahulu.
 */
export async function submitPublicBKKJob(
  data: Partial<BKKJobItem>
): Promise<{ success: boolean; data?: BKKJobItem; error?: string; message?: string }> {
  try {
    const res = await fetch(buildApiUrl("bkk/jobs/submit"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal mengirim pengajuan lowongan" };
    return { success: true, data: json.data, message: json.message };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

/**
 * Admin function: Verifikasi / ubah status lowongan (active / approved, rejected, closed).
 */
export async function updateBKKJobStatus(
  id: number | string,
  status: "active" | "rejected" | "closed" | "pending"
): Promise<{ success: boolean; data?: BKKJobItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`bkk/jobs/${id}/status`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui status lowongan" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function getBKKPartners(): Promise<BKKPartnerItem[]> {
  try {
    const res = await fetch(buildApiUrl("bkk/partners"), { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function createBKKPartner(
  data: Partial<BKKPartnerItem>
): Promise<{ success: boolean; data?: BKKPartnerItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("bkk/partners"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menambah mitra" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function updateBKKPartner(
  id: number | string,
  data: Partial<BKKPartnerItem>
): Promise<{ success: boolean; data?: BKKPartnerItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`bkk/partners/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui mitra" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function deleteBKKPartner(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`bkk/partners/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menghapus mitra" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}
