import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

type RouteContext = { params: Promise<{ id: string }> };

async function proxyDtpItem(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyToBackend(request, ["dtp", id]);
}

export const GET = proxyDtpItem;
export const PUT = proxyDtpItem;
export const DELETE = proxyDtpItem;
