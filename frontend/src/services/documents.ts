import { adminApiUrl } from "@/services/adminApi";

export interface DocumentItem {
  id?: number | string;
  title: string;
  category: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  description?: string;
  downloadCount?: number;
  isPublic?: boolean;
  orderIndex?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getDocumentList(category?: string): Promise<DocumentItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/documents`);
    if (category && category !== "Semua") {
      url.searchParams.set("category", category);
    }
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function getAdminDocumentList(category?: string): Promise<DocumentItem[]> {
  const url = new URL(adminApiUrl("admin/documents"), window.location.origin);
  if (category && category !== "Semua") url.searchParams.set("category", category);
  const res = await fetch(url.toString(), { credentials: "include", cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Gagal memuat dokumen admin");
  return Array.isArray(json.data) ? json.data : [];
}

export async function createDocument(
  data: Partial<DocumentItem>
): Promise<{ success: boolean; data?: DocumentItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("documents"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menyimpan berkas" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function updateDocument(
  id: number | string,
  data: Partial<DocumentItem>
): Promise<{ success: boolean; data?: DocumentItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`documents/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal memperbarui berkas" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function deleteDocument(
  id: number | string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(adminApiUrl(`documents/${id}`), {
      method: "DELETE",
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menghapus berkas" };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

export async function getActiveBrochure(): Promise<DocumentItem | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/documents/active-brochure`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setActiveBrochure(
  documentId: number | string
): Promise<{ success: boolean; data?: DocumentItem; error?: string }> {
  try {
    const res = await fetch(adminApiUrl("documents/active-brochure"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ documentId: Number(documentId) }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || "Gagal menetapkan brosur aktif" };
    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal terhubung ke backend" };
  }
}

