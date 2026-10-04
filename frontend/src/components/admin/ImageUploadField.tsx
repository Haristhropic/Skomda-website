"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Loader2, Link2, AlertCircle } from "lucide-react";
import { adminApiUrl } from "@/services/adminApi";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  recommendedSize?: string;
  required?: boolean;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "skomda/admin-uploads",
  recommendedSize = "Format JPG, PNG, atau WebP (Maks 5MB)",
  required = false,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (file: File) => {
    setErrorMsg(null);

    // Validasi tipe berkas hanya gambar
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Berkas harus berupa gambar (JPG, PNG, WebP, atau GIF).");
      return;
    }

    // Validasi ukuran maks 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Ukuran gambar terlalu besar. Maksimal 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", folder);

      const res = await fetch(adminApiUrl("upload/image"), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengunggah gambar");
      }

      if (json.url) {
        onChange(json.url);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah ke Cloudinary.");
    } finally {
      setIsUploading(false);
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-[#bc0c11]">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Link2 className="size-3" />
          <span>{showUrlInput ? "Tutup input URL" : "Input URL"}</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      {/* Error message */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Image Preview or Dropzone */}
      {value && !isUploading ? (
        <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-white">
            <Image
              src={value}
              alt="Pratinjau Gambar"
              fill
              className="object-cover"
              sizes="64px"
              unoptimized={value.startsWith("http")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-800 truncate" title={value}>
              {value}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {value.includes("cloudinary") ? "Tersimpan di Cloudinary" : "Tersimpan di server"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Hapus gambar"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragActive
              ? "border-[#bc0c11] bg-red-50/50"
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100/60"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center py-2">
              <Loader2 className="size-6 text-[#bc0c11] animate-spin mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Mengunggah gambar ke Cloudinary...
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mohon tunggu sejenak
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-500 mb-2">
                <Upload className="size-5" />
              </div>
              <p className="text-xs font-medium text-slate-700">
                <span className="font-semibold text-[#bc0c11]">Klik untuk pilih gambar</span> atau tarik file ke sini
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {recommendedSize}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Optional direct URL input */}
      {showUrlInput && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... atau /images/..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:border-[#bc0c11] focus:ring-2 focus:ring-red-100 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
