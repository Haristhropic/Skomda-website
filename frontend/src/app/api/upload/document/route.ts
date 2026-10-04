import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

export function POST(request: NextRequest) {
  return proxyToBackend(request, ["upload", "document"]);
}
