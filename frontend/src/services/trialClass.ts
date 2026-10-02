export interface TrialClassParticipant {
  id: number;
  ticketCode: string;
  fullName: string;
  schoolOrigin: string;
  whatsapp: string;
  email?: string;
  major: string;
  status: "registered" | "verified" | "attended" | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getTrialClassParticipants(params?: {
  q?: string;
  major?: string;
  status?: string;
}): Promise<{ data: TrialClassParticipant[]; total: number }> {
  try {
    const url = new URL(`${API_BASE_URL}/trial-class`);
    if (params?.q) url.searchParams.set("q", params.q);
    if (params?.major && params.major !== "Semua") url.searchParams.set("major", params.major);
    if (params?.status && params.status !== "Semua") url.searchParams.set("status", params.status);

    const res = await fetch(url.toString(), {
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      return {
        data: json.data || [],
        total: json.total || 0,
      };
    }
    return { data: [], total: 0 };
  } catch (err) {
    console.error("Gagal mengambil data pendaftar trial class:", err);
    return { data: [], total: 0 };
  }
}

export async function registerTrialClass(data: {
  fullName: string;
  schoolOrigin: string;
  whatsapp: string;
  email?: string;
  major: string;
}): Promise<{ success: boolean; data?: TrialClassParticipant; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/trial-class/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal melakukan pendaftaran" };
    }
    return { success: true, data: json.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal terhubung ke server";
    return { success: false, error: message };
  }
}

export async function checkTrialClassTicket(
  code: string
): Promise<{ success: boolean; data?: TrialClassParticipant; error?: string }> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/trial-class/check-ticket?code=${encodeURIComponent(code)}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Tiket tidak valid" };
    }
    return { success: true, data: json.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memverifikasi tiket";
    return { success: false, error: message };
  }
}

export async function updateTrialClassParticipant(
  id: number,
  data: Partial<TrialClassParticipant>
): Promise<{ success: boolean; data?: TrialClassParticipant; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/trial-class/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal memperbarui status pendaftar" };
    }
    return { success: true, data: json.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal terhubung ke server";
    return { success: false, error: message };
  }
}

export async function deleteTrialClassParticipant(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/trial-class/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal menghapus pendaftar" };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal terhubung ke server";
    return { success: false, error: message };
  }
}
