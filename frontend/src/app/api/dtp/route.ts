import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

export function GET(request: NextRequest) {
  return proxyToBackend(request, ["dtp"]);
}

export function POST(request: NextRequest) {
  return proxyToBackend(request, ["dtp"]);
}
