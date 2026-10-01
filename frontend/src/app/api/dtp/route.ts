import { NextRequest, NextResponse } from "next/server";
import { INITIAL_DTP_ITEMS } from "@/data/initialDtp";
import { DtpItem } from "@/services/dtp";

// In-memory data store for Next.js runtime fallback
let memoryDtpItems: DtpItem[] = [...INITIAL_DTP_ITEMS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    // 1. Coba proxy ke backend Go jika ada
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080/api";
    try {
      const res = await fetch(`${backendUrl}/dtp?${searchParams.toString()}`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          return NextResponse.json(json);
        }
      }
    } catch {
      // Backend Go offline, gunakan memory store
    }

    // 2. Fallback memory / initial data
    let filtered = [...memoryDtpItems];

    if (category && category !== "Semua") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (q) {
      const query = q.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.shortDesc.toLowerCase().includes(query) ||
          (item.coreSkills && item.coreSkills.toLowerCase().includes(query)) ||
          (item.tools && item.tools.toLowerCase().includes(query))
      );
    }

    filtered.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    return NextResponse.json({
      data: filtered,
      total: filtered.length,
      source: "nextjs-online-cache",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengambil data DTP" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json(
        { error: "Nama spesialisasi DTP wajib diisi" },
        { status: 400 }
      );
    }

    // 1. Coba teruskan ke backend Go jika online
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080/api";
    try {
      const authHeader = req.headers.get("authorization");
      const cookie = req.cookies.get("skomda_admin_token")?.value;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authHeader) headers["Authorization"] = authHeader;
      if (cookie) headers["Cookie"] = `skomda_admin_token=${cookie}`;

      const res = await fetch(`${backendUrl}/dtp`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          memoryDtpItems.push(json.data);
          return NextResponse.json(json, { status: 201 });
        }
      }
    } catch {
      // Backend Go offline
    }

    // 2. Simpan ke memory runtime
    const nextId =
      memoryDtpItems.length > 0
        ? Math.max(...memoryDtpItems.map((i) => (typeof i.id === "number" ? i.id : 0))) + 1
        : 1;

    const newItem: DtpItem = {
      ...body,
      id: nextId,
      number: body.number || String(nextId).padStart(2, "0"),
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      image: body.image || "/images/tentang-kami/fasilitas/fasilitas-lab-komputer-1.png",
      orderIndex: body.orderIndex || memoryDtpItems.length + 1,
      isActive: true,
    };

    memoryDtpItems.push(newItem);

    return NextResponse.json(
      {
        message: "Program Digital Talent berhasil ditambahkan",
        data: newItem,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal menyimpan program DTP" },
      { status: 500 }
    );
  }
}
