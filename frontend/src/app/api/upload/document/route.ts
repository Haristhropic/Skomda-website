import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi token otentikasi admin
    const token =
      req.cookies.get("skomda_admin_token")?.value ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return NextResponse.json(
        { error: "Akses ditolak: otentikasi administrator diperlukan untuk mengunggah dokumen." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("document")) as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Berkas dokumen tidak ditemukan. Silakan pilih berkas." },
        { status: 400 }
      );
    }

    // 2. Batas ukuran berkas maksimum 10 MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran berkas melebihi batas maksimum 10 MB." },
        { status: 400 }
      );
    }

    const originalName = file.name;
    const ext = path.extname(originalName).toLowerCase();
    const allowedExts = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
      ".zip",
      ".rar",
      ".txt",
      ".csv",
    ];

    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        {
          error:
            "Format berkas tidak didukung. Format yang diizinkan: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR, TXT, CSV.",
        },
        { status: 400 }
      );
    }

    // Hitung format ukuran berkas
    const sizeInBytes = file.size;
    let fileSize = "";
    if (sizeInBytes < 1024) {
      fileSize = `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      fileSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      fileSize = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    const fileType = ext.replace(".", "").toUpperCase();

    // Sanitasi nama berkas unik
    const nameWithoutExt = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");
    const uniqueFileName = `${nameWithoutExt || "dokumen"}-${Date.now()}${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "documents");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/documents/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileSize,
      fileType,
      originalName,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengunggah berkas dokumen." },
      { status: 500 }
    );
  }
}
