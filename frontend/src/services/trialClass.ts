import { adminApiUrl } from "@/services/adminApi";
import { buildApiUrl } from "@/lib/api";

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

export type TrialClassTicketVerification = Pick<TrialClassParticipant, "ticketCode" | "major" | "fullName">;

export async function getTrialClassParticipants(params?: {
  q?: string;
  major?: string;
  status?: string;
}): Promise<{ data: TrialClassParticipant[]; total: number }> {
  try {
    const url = buildApiUrl("admin/trial-class", {
      q: params?.q,
      major: params?.major,
      status: params?.status,
    });

    const res = await fetch(url, {
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
}): Promise<{ success: boolean; data?: Pick<TrialClassParticipant, "ticketCode">; error?: string }> {
  try {
    const res = await fetch(buildApiUrl("trial-class/register"), {
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
): Promise<{ success: boolean; data?: TrialClassTicketVerification; error?: string }> {
  try {
    const res = await fetch(
      buildApiUrl("trial-class/check-ticket"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        cache: "no-store",
      }
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
    const res = await fetch(adminApiUrl(`trial-class/${id}`), {
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
    const res = await fetch(adminApiUrl(`trial-class/${id}`), {
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

export interface TrialClassEvent {
  id?: number;
  title: string;
  badge: string;
  dateDay: string;
  dateFull: string;
  timeRange: string;
  timezone: string;
  mode: string;
  submode: string;
  status: "open" | "closing_soon" | "closed" | string;
  quota?: number;
  description?: string;
  isActive?: boolean;
}

export const DEFAULT_TRIAL_CLASS_EVENT: TrialClassEvent = {
  title: "Trial Class",
  badge: "JADWAL BELUM DIUMUMKAN",
  dateDay: "",
  dateFull: "",
  timeRange: "",
  timezone: "WIB",
  mode: "Online",
  submode: "(Virtual Class)",
  status: "closed",
  quota: 0,
  description: "Jadwal berikutnya akan diumumkan setelah dikonfirmasi oleh sekolah.",
  isActive: false,
};

export async function getUpcomingTrialClassEvent(): Promise<TrialClassEvent> {
  try {
    const res = await fetch(buildApiUrl("trial-class/event"), {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) throw new Error("Jadwal trial class belum dapat dimuat.");
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
    return DEFAULT_TRIAL_CLASS_EVENT;
  } catch (err) {
    throw new Error("Jadwal trial class belum dapat dimuat.");
  }
}

export async function updateTrialClassEvent(
  data: Partial<TrialClassEvent>
): Promise<{ success: boolean; data?: TrialClassEvent; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("trial-class/event"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || "Gagal memperbarui jadwal event" };
    }
    return { success: true, data: json.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal terhubung ke server";
    return { success: false, error: message };
  }
}

