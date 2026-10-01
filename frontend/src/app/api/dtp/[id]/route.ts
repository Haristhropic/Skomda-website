import { NextRequest, NextResponse } from "next/server";
import { INITIAL_DTP_ITEMS } from "@/data/initialDtp";
import { DtpItem } from "@/services/dtp";

let memoryDtpItems: DtpItem[] = [...INITIAL_DTP_ITEMS];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = memoryDtpItems.find(
    (i) => String(i.id) === id || i.slug === id
  );

  if (!item) {
    return NextResponse.json(
      { error: "Program Digital Talent tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: item });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    let updated: DtpItem | undefined;
    memoryDtpItems = memoryDtpItems.map((item) => {
      if (String(item.id) === id || item.slug === id) {
        const nextItem: DtpItem = { ...item, ...body };
        updated = nextItem;
        return nextItem;
      }
      return item;
    });

    // Coba teruskan ke backend Go jika online
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080/api";
    try {
      const authHeader = req.headers.get("authorization");
      const cookie = req.cookies.get("skomda_admin_token")?.value;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authHeader) headers["Authorization"] = authHeader;
      if (cookie) headers["Cookie"] = `skomda_admin_token=${cookie}`;

      await fetch(`${backendUrl}/dtp/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });
    } catch {
      // Backend Go offline
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Program Digital Talent tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Program Digital Talent berhasil diperbarui",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal memperbarui program DTP" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    memoryDtpItems = memoryDtpItems.filter(
      (item) => String(item.id) !== id && item.slug !== id
    );

    // Coba teruskan ke backend Go jika online
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8080/api";
    try {
      const authHeader = req.headers.get("authorization");
      const cookie = req.cookies.get("skomda_admin_token")?.value;
      const headers: Record<string, string> = {};
      if (authHeader) headers["Authorization"] = authHeader;
      if (cookie) headers["Cookie"] = `skomda_admin_token=${cookie}`;

      await fetch(`${backendUrl}/dtp/${id}`, {
        method: "DELETE",
        headers,
      });
    } catch {
      // Backend Go offline
    }

    return NextResponse.json({
      message: "Program Digital Talent berhasil dihapus",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal menghapus program DTP" },
      { status: 500 }
    );
  }
}
