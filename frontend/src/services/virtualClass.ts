import { buildApiUrl } from "@/lib/api";
import { VIRTUAL_CLASS_DATA, VirtualClassDtpItem, QuizItem } from "@/data/virtualClassData";

const STORAGE_KEY = "skomda_virtual_class_modules";

/**
 * Helper to normalize backend module object into VirtualClassDtpItem
 */
function normalizeBackendModule(m: any): VirtualClassDtpItem {
  const rawQuizzes = Array.isArray(m.quizzes) ? m.quizzes : (Array.isArray(m.Quizzes) ? m.Quizzes : []);
  const quizzes: QuizItem[] = rawQuizzes.length > 0
    ? rawQuizzes.map((q: any) => ({
        id: q.id,
        triggerSeconds: typeof q.triggerSeconds === "number" ? q.triggerSeconds : (typeof q.trigger_seconds === "number" ? q.trigger_seconds : 60),
        question: q.question || "",
        options: Array.isArray(q.options) ? q.options : [],
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : (typeof q.correct_index === "number" ? q.correct_index : 0),
        explanation: q.explanation || "",
      }))
    : [];

  return {
    id: m.slug || String(m.id),
    title: m.title || "",
    desc: m.desc || m.description || "",
    icon: m.icon || "/images/trial-class/dtp-software-developer.png",
    duration: m.duration || "3 menit",
    driveVideoId: m.driveVideoId || m.drive_video_id || "",
    videoUrl: m.videoUrl || m.video_url || "",
    lessonTitle: m.lessonTitle || m.lesson_title || m.title || "",
    lessonDesc: m.lessonDesc || m.lesson_desc || m.desc || "",
    mentor: m.mentor || "Tim Instruktur DTP SKOMDA",
    topics: Array.isArray(m.topics) ? m.topics : [],
    quiz: quizzes[0],
    quizzes: quizzes,
    isActive: m.isActive !== false && m.is_active !== false,
    orderIndex: m.orderIndex || m.order_index || 0,
  };
}

/**
 * Get all active Virtual Class modules directly from Cloud Backend.
 * Strictly dynamic: No static seed mock fallback.
 */
export async function getVirtualClassModules(): Promise<VirtualClassDtpItem[]> {
  try {
    const url = buildApiUrl("virtual-class");
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        const normalized = json.data.map(normalizeBackendModule);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch {
            // ignore localStorage quota
          }
        }
        return normalized;
      }
    }
  } catch (err) {
    console.warn("Backend virtual-class cloud endpoint unreachable:", err);
  }

  // Resilient fallback only to previously synced cloud data from localStorage
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // Return empty array so UI can render cloud empty/loading state without static mock
  return [];
}

/**
 * Admin: Get all Virtual Class modules (including inactive).
 */
export async function getAdminVirtualClassModules(): Promise<VirtualClassDtpItem[]> {
  try {
    const url = buildApiUrl("virtual-class/admin/all");
    const res = await fetch(url, {
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        const normalized = json.data.map(normalizeBackendModule);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          } catch {
            // ignore
          }
        }
        return normalized;
      }
    }
  } catch (err) {
    console.warn("Admin virtual-class all endpoint offline, fallback to getVirtualClassModules:", err);
  }

  return getVirtualClassModules();
}

/**
 * Admin: Create a new module / Digital Talent Program specialization
 */
export async function createVirtualClassModule(
  data: Partial<VirtualClassDtpItem>
): Promise<{ success: boolean; data?: VirtualClassDtpItem; error?: string }> {
  try {
    const url = buildApiUrl("virtual-class");
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: data.title,
        slug: data.id,
        description: data.desc,
        icon: data.icon,
        duration: data.duration,
        driveVideoId: data.driveVideoId,
        videoUrl: data.videoUrl,
        lessonTitle: data.lessonTitle,
        lessonDesc: data.lessonDesc,
        mentor: data.mentor,
        topics: data.topics,
        orderIndex: data.orderIndex,
        isActive: data.isActive !== false,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const created = normalizeBackendModule(json.data || data);
      syncLocalModuleAdd(created);
      return { success: true, data: created };
    } else {
      const errJson = await res.json().catch(() => null);
      return { success: false, error: errJson?.error || "Gagal membuat modul" };
    }
  } catch (err: unknown) {
    console.warn("Backend create module error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Gagal terhubung ke server" };
  }
}

/**
 * Admin: Delete a module / Digital Talent Program specialization
 */
export async function deleteVirtualClassModule(
  moduleId: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = buildApiUrl(`virtual-class/${moduleId}`);
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      syncLocalModuleDelete(String(moduleId));
      return { success: true };
    } else {
      const errJson = await res.json().catch(() => null);
      return { success: false, error: errJson?.error || "Gagal menghapus modul" };
    }
  } catch (err: unknown) {
    console.warn("Backend delete module error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Gagal terhubung ke server" };
  }
}

/**
 * Admin: Update module metadata (video ID, title, mentor, duration, topics, etc.)
 */
export async function updateVirtualClassModule(
  moduleId: string | number,
  data: Partial<VirtualClassDtpItem>
): Promise<{ success: boolean; data?: VirtualClassDtpItem; error?: string }> {
  try {
    const url = buildApiUrl(`virtual-class/${moduleId}`);
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: data.title,
        slug: data.id,
        description: data.desc,
        icon: data.icon,
        duration: data.duration,
        driveVideoId: data.driveVideoId,
        videoUrl: data.videoUrl,
        lessonTitle: data.lessonTitle,
        lessonDesc: data.lessonDesc,
        mentor: data.mentor,
        topics: data.topics,
        orderIndex: data.orderIndex,
        isActive: data.isActive,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const updated = normalizeBackendModule(json.data || data);
      syncLocalModuleUpdate(updated);
      return { success: true, data: updated };
    }
  } catch (err: unknown) {
    console.warn("Backend update error, saving to local store:", err);
  }

  // Update in localStorage if offline or backend error
  const localUpdated: VirtualClassDtpItem = {
    ...(data as VirtualClassDtpItem),
  };
  syncLocalModuleUpdate(localUpdated);
  return { success: true, data: localUpdated };
}

/**
 * Admin: Add a new quiz to a module
 */
export async function addVirtualClassQuiz(
  moduleId: string | number,
  quiz: Omit<QuizItem, "id">
): Promise<{ success: boolean; data?: QuizItem; error?: string }> {
  try {
    const url = buildApiUrl(`virtual-class/${moduleId}/quizzes`);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        triggerSeconds: quiz.triggerSeconds,
        question: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const createdQuiz: QuizItem = {
        id: json.data?.id,
        triggerSeconds: json.data?.triggerSeconds || quiz.triggerSeconds,
        question: json.data?.question || quiz.question,
        options: json.data?.options || quiz.options,
        correctIndex: json.data?.correctIndex ?? quiz.correctIndex,
        explanation: json.data?.explanation || quiz.explanation,
      };
      syncLocalQuizAdd(String(moduleId), createdQuiz);
      return { success: true, data: createdQuiz };
    }
  } catch (err: unknown) {
    console.warn("Backend add quiz error, saving to local store:", err);
  }

  const fallbackQuiz: QuizItem = {
    ...quiz,
    id: `local-q-${Date.now()}`,
  };
  syncLocalQuizAdd(String(moduleId), fallbackQuiz);
  return { success: true, data: fallbackQuiz };
}

/**
 * Admin: Update an existing quiz
 */
export async function updateVirtualClassQuiz(
  moduleId: string | number,
  quizId: string | number,
  quiz: QuizItem
): Promise<{ success: boolean; data?: QuizItem; error?: string }> {
  try {
    const url = buildApiUrl(`virtual-class/quizzes/${quizId}`);
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        triggerSeconds: quiz.triggerSeconds,
        question: quiz.question,
        options: quiz.options,
        correctIndex: quiz.correctIndex,
        explanation: quiz.explanation,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const updated: QuizItem = {
        id: json.data?.id || quizId,
        triggerSeconds: json.data?.triggerSeconds ?? quiz.triggerSeconds,
        question: json.data?.question || quiz.question,
        options: json.data?.options || quiz.options,
        correctIndex: json.data?.correctIndex ?? quiz.correctIndex,
        explanation: json.data?.explanation || quiz.explanation,
      };
      syncLocalQuizUpdate(String(moduleId), updated);
      return { success: true, data: updated };
    }
  } catch (err: unknown) {
    console.warn("Backend update quiz error, updating local store:", err);
  }

  syncLocalQuizUpdate(String(moduleId), quiz);
  return { success: true, data: quiz };
}

/**
 * Admin: Delete a quiz
 */
export async function deleteVirtualClassQuiz(
  moduleId: string | number,
  quizId: string | number
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = buildApiUrl(`virtual-class/quizzes/${quizId}`);
    const res = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      syncLocalQuizDelete(String(moduleId), quizId);
      return { success: true };
    }
  } catch (err: unknown) {
    console.warn("Backend delete quiz error, removing from local store:", err);
  }

  syncLocalQuizDelete(String(moduleId), quizId);
  return { success: true };
}

// ─── LocalStorage Synchronization Helpers ───

function getStoredModules(): VirtualClassDtpItem[] {
  if (typeof window === "undefined") return VIRTUAL_CLASS_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...VIRTUAL_CLASS_DATA];
}

function saveStoredModules(modules: VirtualClassDtpItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
  } catch {}
}

function syncLocalModuleUpdate(updated: VirtualClassDtpItem) {
  const current = getStoredModules();
  const idx = current.findIndex((m) => String(m.id) === String(updated.id));
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...updated };
  } else {
    current.push(updated);
  }
  saveStoredModules(current);
}

function syncLocalModuleAdd(created: VirtualClassDtpItem) {
  const current = getStoredModules();
  current.push(created);
  saveStoredModules(current);
}

function syncLocalModuleDelete(moduleId: string) {
  const current = getStoredModules();
  const filtered = current.filter((m) => String(m.id) !== String(moduleId));
  saveStoredModules(filtered);
}

function syncLocalQuizAdd(moduleId: string, quiz: QuizItem) {
  const current = getStoredModules();
  const mod = current.find((m) => String(m.id) === String(moduleId));
  if (mod) {
    if (!mod.quizzes) mod.quizzes = mod.quiz ? [mod.quiz] : [];
    mod.quizzes.push(quiz);
    mod.quizzes.sort((a, b) => (a.triggerSeconds || 0) - (b.triggerSeconds || 0));
    mod.quiz = mod.quizzes[0];
    saveStoredModules(current);
  }
}

function syncLocalQuizUpdate(moduleId: string, quiz: QuizItem) {
  const current = getStoredModules();
  const mod = current.find((m) => String(m.id) === String(moduleId));
  if (mod && mod.quizzes) {
    const qIdx = mod.quizzes.findIndex((q) => String(q.id) === String(quiz.id));
    if (qIdx >= 0) {
      mod.quizzes[qIdx] = quiz;
      mod.quizzes.sort((a, b) => (a.triggerSeconds || 0) - (b.triggerSeconds || 0));
      mod.quiz = mod.quizzes[0];
      saveStoredModules(current);
    }
  }
}

function syncLocalQuizDelete(moduleId: string, quizId: string | number) {
  const current = getStoredModules();
  const mod = current.find((m) => String(m.id) === String(moduleId));
  if (mod && mod.quizzes) {
    mod.quizzes = mod.quizzes.filter((q) => String(q.id) !== String(quizId));
    if (mod.quizzes.length > 0) {
      mod.quiz = mod.quizzes[0];
    }
    saveStoredModules(current);
  }
}

/**
 * Upload a local video file (MP4, WebM, etc.) to backend storage with progress tracking
 */
export async function uploadVirtualClassVideo(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  return new Promise((resolve) => {
    try {
      const formData = new FormData();
      formData.append("video", file);

      const xhr = new XMLHttpRequest();
      const url = buildApiUrl("upload/video");
      xhr.open("POST", url);
      xhr.withCredentials = true;

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && event.total > 0) {
            const percent = Math.min(100, Math.max(0, Math.round((event.loaded / event.total) * 100)));
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            if (onProgress) onProgress(100);
            resolve({
              success: true,
              url: json.url,
            });
          } else {
            resolve({
              success: false,
              error: json.error || "Gagal mengunggah video",
            });
          }
        } catch {
          resolve({
            success: false,
            error: "Gagal memproses respon server",
          });
        }
      };

      xhr.onerror = () => {
        resolve({
          success: false,
          error: "Terjadi kesalahan jaringan saat mengunggah video",
        });
      };

      xhr.onabort = () => {
        resolve({
          success: false,
          error: "Unggah video dibatalkan",
        });
      };

      xhr.send(formData);
    } catch (err: unknown) {
      resolve({
        success: false,
        error: err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah video",
      });
    }
  });
}
