"use client";

import type { ImageLoaderProps } from "next/image";
import { getCloudinaryUrl } from "./cloudinary";

/** Cloudinary performs responsive transformations at its CDN, outside the VPS. */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const resolved = getCloudinaryUrl(src);
  try {
    const url = new URL(resolved);
    if (url.hostname === "res.cloudinary.com" && url.protocol === "https:") {
      return getCloudinaryUrl(resolved, { width, crop: "limit", quality: quality || 85, format: "auto" });
    }
  } catch { /* Local icons and unmapped originals keep their source path. */ }
  return src;
}
