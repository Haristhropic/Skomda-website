"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Clock,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Pencil,
  X,
  Search,
  Check,
  Upload,
  Play,
  Film,
  FileVideo,
  Eye,
  EyeOff,
  Layers,
  BookOpen,
  User,
  Image as ImageIcon,
  RotateCcw,
  Loader2,
  Link2,
} from "lucide-react";
import {
  getAdminVirtualClassModules,
  createVirtualClassModule,
  updateVirtualClassModule,
  deleteVirtualClassModule,
  addVirtualClassQuiz,
  uploadVirtualClassVideo,
} from "@/services/virtualClass";
import { VirtualClassDtpItem, QuizItem } from "@/data/virtualClassData";
import { adminApiUrl } from "@/services/adminApi";

// Preset icon choices for Digital Talent Program (9 Peminatan DTP SKOMDA)
const PRESET_ICONS = [
  { label: "Software Developer", url: "/images/trial-class/dtp-software-developer.png" },
  { label: "Cyber Security", url: "/images/trial-class/dtp-cyber-security.png" },
  { label: "Artificial Intelligence", url: "/images/trial-class/dtp-artificial-intelligence.png" },
  { label: "Cloud Engineer", url: "/images/trial-class/dtp-cloud-engineer.png" },
  { label: "Network Infrastructure", url: "/images/trial-class/dtp-network-infrastructure.png" },
  { label: "Network Admin", url: "/images/trial-class/dtp-network-admin.png" },
  { label: "IoT & Hardware", url: "/images/trial-class/dtp-iot.png" },
  { label: "Digital Marketing", url: "/images/trial-class/dtp-digital-marketing.png" },
  { label: "Visual Designer", url: "/images/trial-class/dtp-visual-designer.png" },
];

// Helper to safely render module icon with fallback
function SafeModuleIcon({
  src,
  alt,
  width = 40,
  height = 40,
  className = "object-contain",
}: {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center text-slate-400 bg-slate-100 rounded-lg"
        title={alt}
      >
        <ImageIcon className="size-5 text-slate-400" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={() => setError(true)}
    />
  );
}

// Preset icon card with error boundary
function PresetIconItem({
  preset,
  isSelected,
  onSelect,
}: {
  preset: { label: string; url: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative p-2 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer group ${
        isSelected
          ? "border-[#bc0c11] bg-red-50/70 ring-2 ring-[#bc0c11]/20 shadow-2xs"
          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80"
      }`}
      title={preset.label}
    >
      {isSelected && (
        <div className="absolute top-1 right-1 size-4 rounded-full bg-[#bc0c11] text-white flex items-center justify-center shadow-xs z-10">
          <Check className="size-2.5" />
        </div>
      )}
      <div className="size-8 flex items-center justify-center shrink-0">
        {!hasError ? (
          <Image
            src={preset.url}
            alt={preset.label}
            width={32}
            height={32}
            className="object-contain group-hover:scale-105 transition-transform"
            unoptimized
            onError={() => setHasError(true)}
          />
        ) : (
          <ImageIcon className="size-5 text-slate-400" />
        )}
      </div>
      <span
        className={`text-[10px] font-medium leading-tight truncate w-full ${
          isSelected ? "text-[#bc0c11] font-bold" : "text-slate-700"
        }`}
      >
        {preset.label}
      </span>
    </button>
  );
}

// Complete interactive Logo CRUD Manager component
interface ModuleLogoManagerProps {
  value: string;
  onChange: (url: string) => void;
  onShowToast?: (msg: string, type?: "success" | "error") => void;
}

function ModuleLogoManager({ value, onChange, onShowToast }: ModuleLogoManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [value]);

  const activePreset = PRESET_ICONS.find((p) => p.url === value);

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (!["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(file.type)) {
      setUploadError("Berkas harus berupa gambar PNG, JPG, WebP, atau SVG.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "skomda/virtual-class/icons");

      const res = await fetch(adminApiUrl("upload/image"), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengunggah logo ke server.");
      }

      if (json.url) {
        onChange(json.url);
        onShowToast?.("Logo kustom berhasil diunggah ke Cloudinary!", "success");
      }
    } catch (err: any) {
      const errMsg = err?.message || "Gagal mengunggah logo ke server.";
      setUploadError(errMsg);
      onShowToast?.(errMsg, "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Ikon & Logo Program Peminatan
        </label>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Format PNG, WebP, SVG transparan disarankan
        </span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {/* Live Preview & Logo CRUD Actions */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative size-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {value && !previewError ? (
              <Image
                src={value}
                alt="Pratinjau Logo"
                width={40}
                height={40}
                className="object-contain"
                unoptimized
                onError={() => setPreviewError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="size-6 text-slate-400" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 truncate">
                {activePreset ? activePreset.label : "Logo Kustom"}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  activePreset
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : value.includes("cloudinary")
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {activePreset ? "Preset Bawaan" : value.includes("cloudinary") ? "Cloudinary CDN" : "Tautan Kustom"}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5" title={value}>
              {value || "Belum ada logo dipilih"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#bc0c11] hover:bg-[#a00a0e] transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <Upload className="size-3.5" />
                <span>Unggah Logo Baru</span>
              </>
            )}
          </button>

          <button
            type="button"
            title="Reset ke logo bawaan"
            onClick={() => {
              onChange(PRESET_ICONS[0].url);
              onShowToast?.("Logo di-reset ke preset bawaan", "success");
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Preset Icons Selection Grid (9 Icons) */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
          Pilih dari Preset Resmi (9 Peminatan DTP):
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {PRESET_ICONS.map((preset) => (
            <PresetIconItem
              key={preset.url}
              preset={preset}
              isSelected={value === preset.url}
              onSelect={() => onChange(preset.url)}
            />
          ))}
        </div>
      </div>

      {/* Manual URL Input */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Tautan URL Gambar (Kustom atau Eksternal):
        </label>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/trial-class/dtp-... atau https://..."
            className="w-full pl-8 pr-8 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
          />
          <Link2 className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              title="Bersihkan input"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to format seconds into mm:ss
function formatSeconds(sec?: number): string {
  if (typeof sec !== "number" || isNaN(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Helper to extract drive video ID if user pastes full URL
function extractDriveId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export default function VirtualClassManager({
  onShowToast,
}: {
  onShowToast: (text: string, type?: "success" | "error") => void;
}) {
  const [modules, setModules] = useState<VirtualClassDtpItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [mounted, setMounted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<VirtualClassDtpItem | null>(null);
  const [deletingModule, setDeletingModule] = useState<VirtualClassDtpItem | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<"info" | "video_quiz">("info");

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadTarget, setVideoUploadTarget] = useState<"create" | "edit" | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadFileName, setVideoUploadFileName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);

  // Form states for Create Modal
  const [createTitle, setCreateTitle] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createIcon, setCreateIcon] = useState(PRESET_ICONS[0].url);
  const [createDuration, setCreateDuration] = useState("3 menit");
  const [createMentor, setCreateMentor] = useState("Instruktur DTP SKOMDA");
  const [createTopics, setCreateTopics] = useState("");
  const [createLessonTitle, setCreateLessonTitle] = useState("");
  const [createLessonDesc, setCreateLessonDesc] = useState("");
  const [createVideoUrl, setCreateVideoUrl] = useState("");
  const [createDriveVideoId, setCreateDriveVideoId] = useState("");
  const [createIsActive, setCreateIsActive] = useState(true);
  const [createQuizzes, setCreateQuizzes] = useState<
    {
      minute: number;
      second: number;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[]
  >([
    {
      minute: 1,
      second: 0,
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
    },
  ]);

  // Form states for Edit Modal
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formMentor, setFormMentor] = useState("");
  const [formTopics, setFormTopics] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formDriveVideoId, setFormDriveVideoId] = useState("");
  const [formLessonTitle, setFormLessonTitle] = useState("");
  const [formLessonDesc, setFormLessonDesc] = useState("");
  const [formQuizzes, setFormQuizzes] = useState<
    {
      id?: string | number;
      minute: number;
      second: number;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[]
  >([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminVirtualClassModules();
      setModules(data);
    } catch {
      onShowToast("Gagal memuat materi virtual class", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  // Lock body scroll when any modal is open to ensure seamless backdrop coverage
  useEffect(() => {
    if (isCreateOpen || Boolean(editingModule) || Boolean(deletingModule)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCreateOpen, editingModule, deletingModule]);

  // ─── CREATE MODAL HANDLERS ───
  const handleOpenCreate = () => {
    setCreateTitle("");
    setCreateSlug("");
    setCreateDesc("");
    setCreateIcon(PRESET_ICONS[0].url);
    setCreateDuration("3 menit");
    setCreateMentor("Tim Instruktur DTP SKOMDA");
    setCreateTopics("");
    setCreateLessonTitle("");
    setCreateLessonDesc("");
    setCreateVideoUrl("");
    setCreateDriveVideoId("");
    setCreateIsActive(true);
    setCreateQuizzes([
      {
        minute: 1,
        second: 0,
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      },
    ]);
    setIsCreateOpen(true);
  };

  const handleSafeCloseCreate = () => {
    if (isUploadingVideo && videoUploadTarget === "create") {
      if (!window.confirm("Video masih dalam proses unggah. Yakin ingin membatalkan?")) {
        return;
      }
    }
    setIsCreateOpen(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploadingVideo) {
      onShowToast("Mohon tunggu hingga video selesai diunggah sebelum menyimpan modul", "error");
      return;
    }

    if (!createTitle.trim()) {
      onShowToast("Judul modul peminatan DTP wajib diisi", "error");
      return;
    }

    const topicsArray = createTopics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setIsCreating(true);
    try {
      const payload: Partial<VirtualClassDtpItem> = {
        title: createTitle.trim(),
        id: createSlug.trim() || undefined,
        desc: createDesc.trim(),
        icon: createIcon.trim() || PRESET_ICONS[0].url,
        duration: createDuration.trim() || "3 menit",
        mentor: createMentor.trim() || "Tim Instruktur DTP SKOMDA",
        topics: topicsArray,
        lessonTitle: createLessonTitle.trim() || createTitle.trim(),
        lessonDesc: createLessonDesc.trim() || createDesc.trim(),
        videoUrl: createVideoUrl.trim(),
        driveVideoId: extractDriveId(createDriveVideoId),
        isActive: createIsActive,
      };

      const res = await createVirtualClassModule(payload);
      if (!res.success || !res.data) {
        onShowToast(res.error || "Gagal membuat modul DTP baru", "error");
        return;
      }

      const createdMod = res.data;

      // If initial quizzes were entered with valid question, save them to the module
      const validQuizzes = createQuizzes.filter(
        (q) => q.question.trim() && q.options.some((opt) => opt.trim())
      );
      for (const q of validQuizzes) {
        await addVirtualClassQuiz(createdMod.id, {
          triggerSeconds: (Number(q.minute) || 0) * 60 + (Number(q.second) || 0),
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim() || "-"),
          correctIndex: q.correctIndex,
          explanation: q.explanation.trim(),
        });
      }

      onShowToast(`Program DTP "${createTitle}" berhasil ditambahkan!`, "success");
      setIsCreateOpen(false);
      await loadData();
    } catch {
      onShowToast("Terjadi kesalahan saat menambahkan modul", "error");
    } finally {
      setIsCreating(false);
    }
  };

  // ─── EDIT MODAL HANDLERS ───
  const handleOpenEdit = (mod: VirtualClassDtpItem) => {
    setEditingModule(mod);
    setActiveEditTab("info");
    setFormTitle(mod.title || "");
    setFormSlug(mod.id || "");
    setFormDesc(mod.desc || "");
    setFormIcon(mod.icon || PRESET_ICONS[0].url);
    setFormDuration(mod.duration || "3 menit");
    setFormMentor(mod.mentor || "Instruktur SKOMDA");
    setFormTopics((mod.topics || []).join(", "));
    setFormIsActive(mod.isActive !== false);

    setFormVideoUrl(mod.videoUrl || "");
    setFormDriveVideoId(mod.driveVideoId || "");
    setFormLessonTitle(mod.lessonTitle || mod.title);
    setFormLessonDesc(mod.lessonDesc || mod.desc);

    const initialQuizzes = (mod.quizzes && mod.quizzes.length > 0 ? mod.quizzes : [mod.quiz]).map(
      (q, idx) => {
        const totalSec = q.triggerSeconds ?? (idx === 0 ? 50 : 110);
        return {
          id: q.id,
          minute: Math.floor(totalSec / 60),
          second: Math.floor(totalSec % 60),
          question: q.question || "",
          options: q.options && q.options.length >= 2 ? [...q.options] : ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
          correctIndex: q.correctIndex ?? 0,
          explanation: q.explanation || "",
        };
      }
    );
    setFormQuizzes(initialQuizzes);
  };

  const handleCloseEdit = () => {
    setEditingModule(null);
  };

  const handleSafeCloseEdit = () => {
    if (isUploadingVideo && videoUploadTarget === "edit") {
      if (!window.confirm("Video masih dalam proses unggah. Yakin ingin membatalkan?")) {
        return;
      }
    }
    handleCloseEdit();
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    if (isUploadingVideo) {
      onShowToast("Mohon tunggu hingga video selesai diunggah sebelum menyimpan modul", "error");
      return;
    }

    if (!formTitle.trim()) {
      onShowToast("Judul modul peminatan DTP tidak boleh kosong", "error");
      return;
    }

    const cleanVideoUrl = formVideoUrl.trim();
    const cleanDriveId = extractDriveId(formDriveVideoId);

    // Validate quizzes
    for (let i = 0; i < formQuizzes.length; i++) {
      const q = formQuizzes[i];
      if (!q.question.trim()) {
        onShowToast(`Pertanyaan Kuis ${i + 1} tidak boleh kosong`, "error");
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        onShowToast(`Semua 4 pilihan jawaban pada Kuis ${i + 1} wajib diisi`, "error");
        return;
      }
    }

    setIsSaving(true);
    try {
      const updatedQuizzes: QuizItem[] = formQuizzes.map((q) => ({
        id: q.id,
        triggerSeconds: (Number(q.minute) || 0) * 60 + (Number(q.second) || 0),
        question: q.question.trim(),
        options: q.options.map((o) => o.trim()),
        correctIndex: q.correctIndex,
        explanation: q.explanation.trim(),
      }));

      updatedQuizzes.sort((a, b) => (a.triggerSeconds || 0) - (b.triggerSeconds || 0));

      const topicsArray = formTopics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const updatedModule: VirtualClassDtpItem = {
        ...editingModule,
        title: formTitle.trim(),
        id: formSlug.trim() || editingModule.id,
        desc: formDesc.trim(),
        icon: formIcon.trim(),
        duration: formDuration.trim(),
        mentor: formMentor.trim(),
        topics: topicsArray,
        isActive: formIsActive,
        videoUrl: cleanVideoUrl,
        driveVideoId: cleanDriveId,
        lessonTitle: formLessonTitle.trim(),
        lessonDesc: formLessonDesc.trim(),
        quiz: updatedQuizzes[0],
        quizzes: updatedQuizzes,
      };

      const res = await updateVirtualClassModule(editingModule.id, updatedModule);
      if (!res.success) {
        onShowToast(res.error || "Gagal memperbarui modul", "error");
        return;
      }

      onShowToast(`Modul "${formTitle}" berhasil diperbarui!`, "success");
      handleCloseEdit();
      await loadData();
    } catch {
      onShowToast("Gagal menyimpan perubahan materi", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── DELETE HANDLER ───
  const handleDeleteConfirm = async () => {
    if (!deletingModule) return;
    setIsDeleting(true);
    try {
      const res = await deleteVirtualClassModule(deletingModule.id);
      if (res.success) {
        onShowToast(`Modul "${deletingModule.title}" berhasil dihapus`, "success");
        setDeletingModule(null);
        await loadData();
      } else {
        onShowToast(res.error || "Gagal menghapus modul", "error");
      }
    } catch {
      onShowToast("Terjadi kesalahan saat menghapus modul", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── VIDEO UPLOAD HANDLERS ───
  const handleVideoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "edit" | "create"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      onShowToast("Ukuran video melebihi batas 100MB", "error");
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadTarget(target);
    setVideoUploadProgress(0);
    setVideoUploadFileName(file.name);
    onShowToast(`Memulai unggah video "${file.name}"...`, "success");

    try {
      const res = await uploadVirtualClassVideo(file, (progress) => {
        setVideoUploadProgress(progress);
      });
      if (res.success && res.url) {
        if (target === "edit") {
          setFormVideoUrl(res.url);
        } else {
          setCreateVideoUrl(res.url);
        }
        onShowToast("Video berhasil diunggah!", "success");
      } else {
        onShowToast(res.error || "Gagal mengunggah video", "error");
      }
    } catch {
      onShowToast("Terjadi kesalahan saat mengunggah video", "error");
    } finally {
      setIsUploadingVideo(false);
      setVideoUploadTarget(null);
      setVideoUploadProgress(0);
      setVideoUploadFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (createFileInputRef.current) createFileInputRef.current.value = "";
    }
  };

  // Quiz rows management for Edit
  const handleAddNewQuizRow = () => {
    const nextMinute = formQuizzes.length + 1;
    setFormQuizzes((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        minute: nextMinute,
        second: 0,
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      },
    ]);
  };

  const handleRemoveQuizRow = (idxToRemove: number) => {
    if (formQuizzes.length <= 1) {
      onShowToast("Minimal harus ada 1 kuis untuk video ini", "error");
      return;
    }
    setFormQuizzes((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleOptionChange = (quizIdx: number, optIdx: number, value: string) => {
    setFormQuizzes((prev) => {
      const copy = [...prev];
      const target = { ...copy[quizIdx] };
      const opts = [...target.options];
      opts[optIdx] = value;
      target.options = opts;
      copy[quizIdx] = target;
      return copy;
    });
  };

  // Quiz rows management for Create
  const handleAddNewCreateQuiz = () => {
    setCreateQuizzes((prev) => [
      ...prev,
      {
        minute: prev.length + 1,
        second: 0,
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      },
    ]);
  };

  const handleRemoveCreateQuiz = (idxToRemove: number) => {
    setCreateQuizzes((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleCreateOptionChange = (quizIdx: number, optIdx: number, value: string) => {
    setCreateQuizzes((prev) => {
      const copy = [...prev];
      const target = { ...copy[quizIdx] };
      const opts = [...target.options];
      opts[optIdx] = value;
      target.options = opts;
      copy[quizIdx] = target;
      return copy;
    });
  };

  const filteredModules = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.topics && m.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-sm border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-jakarta">
            Kelola Modul Peminatan & Kuis Virtual Class
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Daftar modul peminatan di bawah ini tampil secara dinamis pada halaman Virtual Class siswa. Anda dapat menambah peminatan baru, mengubah detail program, mengunggah video MP4/WebM, dan menyisipkan titik kuis interaktif.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/20 flex items-center gap-2"
          >
            <span>{isLoading ? "Memuat..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#bc0c11] hover:bg-[#a00a0e] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
          >
            <Plus className="size-4" />
            <span>Tambah Modul DTP Baru</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul peminatan, materi, topik, atau instruktur..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium px-2">
          <span>Total:</span>
          <strong className="text-slate-800">{filteredModules.length} Modul DTP</strong>
        </div>
      </div>

      {/* Modules Grid */}
      {isLoading ? (
        <div className="py-20 text-center bg-white rounded-xl border border-slate-200">
          <div className="size-8 border-3 border-slate-200 border-t-[#bc0c11] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">Memuat data modul virtual class...</p>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="py-16 bg-white rounded-xl border border-slate-200 text-center p-6">
          <AlertCircle className="size-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">Tidak ada modul yang cocok</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Coba kata kunci pencarian lain atau tambahkan modul peminatan baru.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-primary !h-[40px] !px-4 text-xs mx-auto inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Tambah Modul Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const quizList = mod.quizzes && mod.quizzes.length > 0 ? mod.quizzes : [mod.quiz];
            const hasDirectVideo = Boolean(mod.videoUrl);
            const hasDriveVideo = Boolean(mod.driveVideoId);
            const isActive = mod.isActive !== false;

            return (
              <div
                key={mod.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4 relative group"
              >
                {/* Header Icon, Title & Status */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative size-12 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0">
                      <SafeModuleIcon
                        src={mod.icon || PRESET_ICONS[0].url}
                        alt={mod.title}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {isActive ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                        {isActive ? "Aktif" : "Non-aktif"}
                      </span>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        <Clock className="size-3 text-slate-500" />
                        <span>{mod.duration || "3 menit"}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-jakarta font-bold text-base text-slate-900 leading-snug line-clamp-1">
                    {mod.title}
                  </h3>
                  <p className="font-jakarta text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {mod.desc || mod.lessonDesc}
                  </p>

                  {/* Topics Pills */}
                  {mod.topics && mod.topics.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-2.5">
                      {mod.topics.slice(0, 3).map((top, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-100"
                        >
                          {top}
                        </span>
                      ))}
                      {mod.topics.length > 3 && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          +{mod.topics.length - 3} lagi
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Video & Quiz Meta Info */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Film className="size-3.5 text-blue-600" />
                      Sumber Video:
                    </span>
                    {hasDirectVideo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 truncate max-w-[150px]">
                        <Check className="size-3 shrink-0" />
                        Direct MP4
                      </span>
                    ) : hasDriveVideo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium text-[11px] border border-amber-200">
                        Google Drive
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">
                        Belum disetel
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 flex items-center gap-1">
                      <HelpCircle className="size-3.5 text-amber-500" />
                      Kuis Interaktif:
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      {quizList.length} Kuis
                    </span>
                  </div>

                  {/* Mentor Info */}
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <User className="size-3.5 text-slate-500" />
                      Mentor:
                    </span>
                    <span className="text-slate-700 font-medium truncate max-w-[180px]">
                      {mod.mentor || "Instruktur SKOMDA"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Edit & Delete */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(mod)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="size-3.5" />
                    <span>Kelola & Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingModule(mod)}
                    className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer border border-red-200 flex items-center justify-center"
                    title="Hapus Modul DTP"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL: TAMBAH MODUL DTP BARU (CREATE)
      ═══════════════════════════════════════════════════════════════════════════ */}
      {mounted && isCreateOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-red-50 text-[#bc0c11] border border-red-100 flex items-center justify-center shrink-0">
                  <Plus className="size-5" />
                </div>
                <div>
                  <h3 className="font-jakarta font-bold text-base sm:text-lg text-slate-900">
                    Tambah Modul Peminatan DTP Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data modul ini akan langsung tampil di halaman Virtual Class siswa.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSafeCloseCreate}
                className="size-8 rounded-lg bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="size-3.5 text-[#bc0c11]" />
                  Informasi Program Peminatan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Peminatan / Judul Modul *
                    </label>
                    <input
                      type="text"
                      required
                      value={createTitle}
                      onChange={(e) => setCreateTitle(e.target.value)}
                      placeholder="Contoh: Cloud & DevOps Specialist"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Slug / ID Unik (Opsional)
                    </label>
                    <input
                      type="text"
                      value={createSlug}
                      onChange={(e) => setCreateSlug(e.target.value)}
                      placeholder="cloud-devops (otomatis jika kosong)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deskripsi Ringkas Peminatan *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={createDesc}
                    onChange={(e) => setCreateDesc(e.target.value)}
                    placeholder="Jelaskan secara ringkas kompetensi yang dipelajari pada peminatan ini..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimasi Durasi Belajar
                    </label>
                    <input
                      type="text"
                      value={createDuration}
                      onChange={(e) => setCreateDuration(e.target.value)}
                      placeholder="Contoh: 3 menit / 5 menit"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Mentor / Instruktur
                    </label>
                    <input
                      type="text"
                      value={createMentor}
                      onChange={(e) => setCreateMentor(e.target.value)}
                      placeholder="Contoh: Kak Dimas - Cloud Specialist"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Topik / Keahlian Utama (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={createTopics}
                    onChange={(e) => setCreateTopics(e.target.value)}
                    placeholder="Contoh: Docker, Kubernetes, CI/CD Pipeline, AWS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                  />
                </div>

                {/* Pilih & Kelola Ikon Program Peminatan (CRUD) */}
                <ModuleLogoManager
                  value={createIcon}
                  onChange={setCreateIcon}
                  onShowToast={onShowToast}
                />
              </div>

              {/* Video Configuration */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="size-3.5 text-blue-600" />
                  Materi Video Pembelajaran
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Judul Pelajaran Video
                    </label>
                    <input
                      type="text"
                      value={createLessonTitle}
                      onChange={(e) => setCreateLessonTitle(e.target.value)}
                      placeholder="Contoh: Pengenalan Container & Docker"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Deskripsi Pelajaran
                    </label>
                    <input
                      type="text"
                      value={createLessonDesc}
                      onChange={(e) => setCreateLessonDesc(e.target.value)}
                      placeholder="Contoh: Memahami arsitektur modern..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>
                </div>

                {/* Upload or URL Video */}
                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Unggah Berkas Video Langsung (MP4 / WebM)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        File disimpan aman di server web dengan streaming stabil tanpa batasan kuota Google Drive.
                      </span>
                    </div>

                    <input
                      ref={createFileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => handleVideoFileChange(e, "create")}
                    />

                    <button
                      type="button"
                      disabled={isUploadingVideo}
                      onClick={() => createFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:cursor-not-allowed"
                    >
                      {isUploadingVideo && videoUploadTarget === "create" ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin text-white" />
                          <span>Mengunggah ({videoUploadProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-3.5" />
                          <span>Pilih File Video</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Video Upload Progress Indicator */}
                  {isUploadingVideo && videoUploadTarget === "create" && (
                    <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-semibold text-amber-900 truncate">
                          <Loader2 className="size-3.5 animate-spin text-[#bc0c11] shrink-0" />
                          <span className="truncate">
                            {videoUploadProgress < 100
                              ? `Mengunggah: ${videoUploadFileName}`
                              : "Memproses video di server..."}
                          </span>
                        </div>
                        <span className="font-bold text-amber-900 font-mono shrink-0 ml-2">
                          {videoUploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#bc0c11] h-2 rounded-full transition-all duration-200 ease-out"
                          style={{ width: `${Math.max(4, videoUploadProgress)}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-medium text-amber-700 flex items-center gap-1.5">
                        <AlertCircle className="size-3 shrink-0" />
                        <span>Tombol simpan dinonaktifkan sementara hingga unggah video selesai.</span>
                      </p>
                    </div>
                  )}

                  {createVideoUrl && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono break-all">
                      <Check className="size-4 shrink-0 text-emerald-600" />
                      <span className="truncate">{createVideoUrl}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Atau Masukkan URL Video Langsung:
                    </label>
                    <input
                      type="text"
                      value={createVideoUrl}
                      onChange={(e) => setCreateVideoUrl(e.target.value)}
                      placeholder="https://... atau /uploads/videos/video.mp4"
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Quizzes Section */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="size-3.5 text-amber-500" />
                    Kuis Interaktif di Dalam Video ({createQuizzes.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddNewCreateQuiz}
                    className="text-xs text-[#bc0c11] hover:text-[#a00a0e] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Tambah Kuis</span>
                  </button>
                </div>

                {createQuizzes.map((quiz, qIdx) => (
                  <div
                    key={qIdx}
                    className="rounded-xl border border-slate-200 p-4 bg-white space-y-3 shadow-2xs relative"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="size-6 rounded-full bg-[#bc0c11] text-white text-xs font-bold flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          Muncul di Video Menit & Detik:
                        </span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={quiz.minute}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setCreateQuizzes((prev) => {
                                const copy = [...prev];
                                copy[qIdx].minute = val;
                                return copy;
                              });
                            }}
                            className="w-14 px-2 py-1 rounded-md border border-slate-200 text-xs text-center font-bold"
                          />
                          <span className="text-xs text-slate-400">:</span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={quiz.second}
                            onChange={(e) => {
                              const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                              setCreateQuizzes((prev) => {
                                const copy = [...prev];
                                copy[qIdx].second = val;
                                return copy;
                              });
                            }}
                            className="w-14 px-2 py-1 rounded-md border border-slate-200 text-xs text-center font-bold"
                          />
                        </div>
                      </div>

                      {createQuizzes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCreateQuiz(qIdx)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Pertanyaan Kuis:
                      </label>
                      <input
                        type="text"
                        value={quiz.question}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCreateQuizzes((prev) => {
                            const copy = [...prev];
                            copy[qIdx].question = val;
                            return copy;
                          });
                        }}
                        placeholder="Contoh: Apa fungsi utama dari container dalam cloud architecture?"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-slate-600">
                        Pilihan Jawaban (Pilih radio untuk jawaban yang benar):
                      </label>
                      {quiz.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`create_correct_${qIdx}`}
                            checked={quiz.correctIndex === optIdx}
                            onChange={() => {
                              setCreateQuizzes((prev) => {
                                const copy = [...prev];
                                copy[qIdx].correctIndex = optIdx;
                                return copy;
                              });
                            }}
                            className="text-[#bc0c11] focus:ring-[#bc0c11] size-4 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-500 w-4">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleCreateOptionChange(qIdx, optIdx, e.target.value)}
                            placeholder={`Pilihan ${String.fromCharCode(65 + optIdx)}`}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Penjelasan / Pembahasan Singkat:
                      </label>
                      <input
                        type="text"
                        value={quiz.explanation}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCreateQuizzes((prev) => {
                            const copy = [...prev];
                            copy[qIdx].explanation = val;
                            return copy;
                          });
                        }}
                        placeholder="Penjelasan yang tampil setelah siswa menjawab..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Aktif */}
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="create_is_active"
                  checked={createIsActive}
                  onChange={(e) => setCreateIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-[#bc0c11] focus:ring-[#bc0c11] size-4 cursor-pointer"
                />
                <label htmlFor="create_is_active" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Aktifkan modul ini langsung agar dapat dipilih oleh siswa di Virtual Class
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSafeCloseCreate}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUploadingVideo}
                  className="btn-primary !h-[42px] !px-6 text-xs font-bold cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan Modul...</span>
                    </>
                  ) : isUploadingVideo ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Menunggu Unggah Video ({videoUploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      <span>Simpan & Terbitkan Modul</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL: EDIT MODUL DTP (INFO & VIDEO/KUIS)
      ═══════════════════════════════════════════════════════════════════════════ */}
      {mounted && editingModule && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative size-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <SafeModuleIcon
                    src={formIcon || editingModule.icon || PRESET_ICONS[0].url}
                    alt={editingModule.title}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-jakarta font-bold text-base sm:text-lg text-slate-900 truncate">
                    Kelola Modul: {editingModule.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID / Slug: <span className="font-mono text-slate-700">{editingModule.id}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSafeCloseEdit}
                className="size-8 rounded-lg bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Tab Navigation inside Modal */}
            <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setActiveEditTab("info")}
                className={`py-3 px-4 font-jakarta text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeEditTab === "info"
                    ? "border-[#bc0c11] text-[#bc0c11]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="size-4" />
                <span>1. Informasi Program DTP</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab("video_quiz")}
                className={`py-3 px-4 font-jakarta text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeEditTab === "video_quiz"
                    ? "border-[#bc0c11] text-[#bc0c11]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Film className="size-4" />
                <span>2. Video Pembelajaran & Kuis ({formQuizzes.length})</span>
                {isUploadingVideo && videoUploadTarget === "edit" && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse flex items-center gap-1">
                    <Loader2 className="size-2.5 animate-spin text-[#bc0c11]" />
                    <span>{videoUploadProgress}%</span>
                  </span>
                )}
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveAll} className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeEditTab === "info" ? (
                /* TAB 1: INFORMASI PROGRAM */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Peminatan / Judul Program *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Contoh: Software Developer"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Slug / ID Modul
                      </label>
                      <input
                        type="text"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        placeholder="software-developer"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11] font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Deskripsi Program Peminatan *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Deskripsi singkat mengenai program keahlian ini..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estimasi Durasi
                      </label>
                      <input
                        type="text"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                        placeholder="Contoh: 3 menit"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Mentor / Instruktur
                      </label>
                      <input
                        type="text"
                        value={formMentor}
                        onChange={(e) => setFormMentor(e.target.value)}
                        placeholder="Contoh: Kak Farhan - Lead Developer"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Topik / Keahlian Utama (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={formTopics}
                      onChange={(e) => setFormTopics(e.target.value)}
                      placeholder="Contoh: React, TypeScript, Next.js, API Integration"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                    />
                  </div>

                  {/* Preset Ikon & Kelola Logo (CRUD) */}
                  <ModuleLogoManager
                    value={formIcon}
                    onChange={setFormIcon}
                    onShowToast={onShowToast}
                  />

                  {/* Status Aktif */}
                  <div className="pt-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="edit_is_active"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="rounded border-slate-300 text-[#bc0c11] focus:ring-[#bc0c11] size-4 cursor-pointer"
                    />
                    <label htmlFor="edit_is_active" className="text-xs font-semibold text-slate-800 cursor-pointer">
                      Tampilkan modul ini di halaman Virtual Class (Status Aktif)
                    </label>
                  </div>
                </div>
              ) : (
                /* TAB 2: VIDEO & KUIS */
                <div className="space-y-6">
                  {/* Lesson Meta */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Judul Pelajaran Video
                        </label>
                        <input
                          type="text"
                          value={formLessonTitle}
                          onChange={(e) => setFormLessonTitle(e.target.value)}
                          placeholder="Judul bab materi video..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Deskripsi Pelajaran
                        </label>
                        <input
                          type="text"
                          value={formLessonDesc}
                          onChange={(e) => setFormLessonDesc(e.target.value)}
                          placeholder="Penjelasan topik video..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Video Box */}
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          File Video Pembelajaran (MP4 / WebM)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Unggah video dari perangkat Anda untuk disimpan langsung pada server.
                        </span>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={(e) => handleVideoFileChange(e, "edit")}
                      />

                      <button
                        type="button"
                        disabled={isUploadingVideo}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:cursor-not-allowed"
                      >
                        {isUploadingVideo && videoUploadTarget === "edit" ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin text-white" />
                            <span>Mengunggah ({videoUploadProgress}%)...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="size-3.5" />
                            <span>Unggah Video Baru</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Video Upload Progress Indicator */}
                    {isUploadingVideo && videoUploadTarget === "edit" && (
                      <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-semibold text-amber-900 truncate">
                            <Loader2 className="size-3.5 animate-spin text-[#bc0c11] shrink-0" />
                            <span className="truncate">
                              {videoUploadProgress < 100
                                ? `Mengunggah: ${videoUploadFileName}`
                                : "Memproses video di server..."}
                            </span>
                          </div>
                          <span className="font-bold text-amber-900 font-mono shrink-0 ml-2">
                            {videoUploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#bc0c11] h-2 rounded-full transition-all duration-200 ease-out"
                            style={{ width: `${Math.max(4, videoUploadProgress)}%` }}
                          />
                        </div>
                        <p className="text-[11px] font-medium text-amber-700 flex items-center gap-1.5">
                          <AlertCircle className="size-3 shrink-0" />
                          <span>Tombol simpan dinonaktifkan sementara hingga unggah video selesai.</span>
                        </p>
                      </div>
                    )}

                    {formVideoUrl && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono break-all">
                          <Check className="size-4 shrink-0 text-emerald-600" />
                          <span className="truncate">{formVideoUrl}</span>
                        </div>
                        <video
                          src={formVideoUrl}
                          controls
                          className="w-full max-h-48 rounded-lg bg-black object-contain"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL Video Langsung:
                      </label>
                      <input
                        type="text"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        placeholder="https://... atau /uploads/videos/file.mp4"
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                      />
                    </div>
                  </div>

                  {/* Quizzes List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="size-3.5 text-amber-500" />
                        Titik Kuis Interaktif ({formQuizzes.length})
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddNewQuizRow}
                        className="text-xs text-[#bc0c11] hover:text-[#a00a0e] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                        <span>Tambah Kuis</span>
                      </button>
                    </div>

                    {formQuizzes.map((quiz, qIdx) => (
                      <div
                        key={qIdx}
                        className="rounded-xl border border-slate-200 p-4 bg-white space-y-3 shadow-2xs relative"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="size-6 rounded-full bg-[#bc0c11] text-white text-xs font-bold flex items-center justify-center">
                              {qIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              Muncul di Menit & Detik:
                            </span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                value={quiz.minute}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value) || 0);
                                  setFormQuizzes((prev) => {
                                    const copy = [...prev];
                                    copy[qIdx].minute = val;
                                    return copy;
                                  });
                                }}
                                className="w-14 px-2 py-1 rounded-md border border-slate-200 text-xs text-center font-bold"
                              />
                              <span className="text-xs text-slate-400">:</span>
                              <input
                                type="number"
                                min="0"
                                max="59"
                                value={quiz.second}
                                onChange={(e) => {
                                  const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
                                  setFormQuizzes((prev) => {
                                    const copy = [...prev];
                                    copy[qIdx].second = val;
                                    return copy;
                                  });
                                }}
                                className="w-14 px-2 py-1 rounded-md border border-slate-200 text-xs text-center font-bold"
                              />
                            </div>
                          </div>

                          {formQuizzes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveQuizRow(qIdx)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Pertanyaan Kuis:
                          </label>
                          <input
                            type="text"
                            value={quiz.question}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormQuizzes((prev) => {
                                const copy = [...prev];
                                copy[qIdx].question = val;
                                return copy;
                              });
                            }}
                            placeholder="Contoh: Apa fungsi framework Next.js?"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Pilihan Jawaban (Klik radio untuk kunci jawaban benar):
                          </label>
                          {quiz.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`edit_correct_${qIdx}`}
                                checked={quiz.correctIndex === optIdx}
                                onChange={() => {
                                  setFormQuizzes((prev) => {
                                    const copy = [...prev];
                                    copy[qIdx].correctIndex = optIdx;
                                    return copy;
                                  });
                                }}
                                className="text-[#bc0c11] focus:ring-[#bc0c11] size-4 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-500 w-4">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                placeholder={`Pilihan ${String.fromCharCode(65 + optIdx)}`}
                                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Pembahasan / Penjelasan Jawaban:
                          </label>
                          <input
                            type="text"
                            value={quiz.explanation}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormQuizzes((prev) => {
                                const copy = [...prev];
                                copy[qIdx].explanation = val;
                                return copy;
                              });
                            }}
                            placeholder="Penjelasan yang tampil setelah siswa menjawab..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#bc0c11]/20 focus:border-[#bc0c11]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleSafeCloseEdit}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingVideo}
                  className="btn-primary !h-[42px] !px-6 text-xs font-bold cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan Perubahan...</span>
                    </>
                  ) : isUploadingVideo ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Menunggu Unggah Video ({videoUploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODAL: KONFIRMASI HAPUS MODUL DTP
      ═══════════════════════════════════════════════════════════════════════════ */}
      {mounted && deletingModule && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-fade-in text-center">
            <div className="size-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 className="size-6" />
            </div>

            <h3 className="font-jakarta font-bold text-lg text-slate-900">
              Hapus Modul Peminatan DTP?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus modul <strong className="text-slate-800">&quot;{deletingModule.title}&quot;</strong>? Semua video pembelajaran dan kuis di dalamnya akan dihapus secara permanen dari Virtual Class.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingModule(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>Ya, Hapus Modul</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
