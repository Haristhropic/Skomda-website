"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  Loader2,
  Link2,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

interface DocumentUploadFieldProps {
  label: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  onChange: (data: {
    fileUrl: string;
    fileSize?: string;
    fileType?: string;
    originalName?: string;
  }) => void;
  folder?: string;
  required?: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export default function DocumentUploadField({
  label,
  fileUrl,
  fileSize,
  fileType,
  onChange,
  folder = "skomda/documents",
  required = false,
}: DocumentUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgressName, setUploadProgressName] = useState("");

  const formatFileTypeBadge = (type?: string) => {
    const t = (type || "").toUpperCase();
    if (t === "PDF") {
      return {
        bg: "bg-red-50 text-red-700 border-red-200",
        icon: <FileText className="size-5 text-red-600" />,
      };
    }
    if (["DOC", "DOCX"].includes(t)) {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <FileText className="size-5 text-blue-600" />,
      };
    }
    if (["XLS", "XLSX", "CSV"].includes(t)) {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <FileSpreadsheet className="size-5 text-emerald-600" />,
      };
    }
    if (["ZIP", "RAR", "7Z"].includes(t)) {
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <FileArchive className="size-5 text-amber-600" />,
      };
    }
    return {
      bg: "bg-slate-50 text-slate-700 border-slate-200",
      icon: <FileCode className="size-5 text-slate-600" />,
    };
  };

  const handleFileChange = async (file: File) => {
    setErrorMsg(null);

    // Validasi ukuran berkas maksimal 50MB
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg("Ukuran berkas terlalu besar. Maksimal 50MB.");
      return;
    }

    setUploadProgressName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Prioritaskan upload ke Go backend API (Cloudinary Raw Storage)
      let uploadRes = await fetch(`${API_BASE_URL}/upload/document`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      // Jika backend belum aktif atau offline di lingkungan lokal, fallback ke Next.js API route
      if (!uploadRes.ok) {
        uploadRes = await fetch("/api/upload/document", {
          method: "POST",
          body: formData,
        });
      }

      const json = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(json.error || "Gagal mengunggah berkas dokumen");
      }

      if (json.url) {
        onChange({
          fileUrl: json.url,
          fileSize: json.fileSize,
          fileType: json.fileType || json.format,
          originalName: json.originalName || file.name,
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah berkas dokumen ke server.");
    } finally {
      setIsUploading(false);
      setUploadProgressName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const badgeStyle = formatFileTypeBadge(fileType);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-[#bc0c11]">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Link2 className="size-3" />
          <span>{showManualInput ? "Tutup input URL manual" : "Input URL / Path manual"}</span>
        </button>
      </div>

      {/* Input Berkas Tersembunyi */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.csv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      {/* Pesan Kesalahan */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tampilan Sedang Mengunggah */}
      {isUploading && (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#bc0c11]/40 bg-red-50/30 rounded-2xl animate-pulse text-center">
          <Loader2 className="size-7 text-[#bc0c11] animate-spin mb-2" />
          <p className="text-xs font-semibold text-slate-800">
            Mengunggah berkas ke penyimpanan...
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">
            {uploadProgressName}
          </p>
        </div>
      )}

      {/* Kartu Pratinjau Berkas yang Sudah Diunggah */}
      {!isUploading && fileUrl && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${badgeStyle.bg}`}>
              {badgeStyle.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${badgeStyle.bg}`}>
                  {fileType || "DOKUMEN"}
                </span>
                {fileSize && (
                  <span className="text-[11px] font-medium text-slate-500">
                    {fileSize}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-900 truncate mt-0.5" title={fileUrl}>
                {fileUrl.split("/").pop() || fileUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
              title="Buka / Unduh Berkas"
            >
              <ExternalLink className="size-3.5" />
              <span>Buka</span>
            </a>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              title="Ganti Berkas Dokumen"
            >
              <RotateCcw className="size-3.5" />
              <span>Ganti</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  fileUrl: "",
                  fileSize: "",
                  fileType: "PDF",
                  originalName: "",
                })
              }
              className="flex size-7 items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Hapus Berkas"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dropzone untuk Memilih Berkas Baru (jika belum ada berkas atau saat kosong) */}
      {!isUploading && !fileUrl && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 sm:p-7 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            dragActive
              ? "border-[#bc0c11] bg-red-50/40 scale-[0.99]"
              : "border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400"
          }`}
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200 text-slate-600 mb-2.5">
            <Upload className="size-5 text-[#bc0c11]" />
          </div>
          <p className="text-xs font-bold text-slate-800 text-center">
            Pilih Berkas Dokumen atau Tarik ke Sini
          </p>
          <p className="text-[11px] text-slate-500 text-center mt-1">
            Format didukung: PDF, DOCX, XLSX, PPTX, ZIP (Maks 50MB)
          </p>
          <button
            type="button"
            className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 transition-colors pointer-events-none"
          >
            Pilih Berkas dari Komputer
          </button>
        </div>
      )}

      {/* Input Manual URL / Path Dokumen */}
      {showManualInput && (
        <div className="pt-2 animate-in fade-in-0 duration-150">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Tautan / Path Dokumen Manual
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="/documents/nama-berkas.pdf atau https://drive.google.com/..."
              value={fileUrl}
              onChange={(e) => onChange({ fileUrl: e.target.value })}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
