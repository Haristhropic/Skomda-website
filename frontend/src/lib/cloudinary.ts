/**
 * Cloudinary Image Helper untuk SMK Telkom Sidoarjo Website.
 *
 * Mengoptimalkan pemuatan gambar dengan otomatisasi format (AVIF/WebP),
 * penyesuaian kualitas dinamis (q_auto), dan responsive resizing (w_xxx).
 *
 * Sesuai strategi hibrida:
 * - Foto konten (guru, siswa, fasilitas, berita): Dioptimalkan lewat Cloudinary CDN.
 * - Format vektor (SVG), icon kecil, dan logo statis: Tetap dimuat dari folder lokal `public/`.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "thumb" | "scale" | "limit" | "fit" | "pad";
  gravity?: "auto" | "face" | "faces" | "center" | "north";
  quality?: "auto" | "auto:best" | "auto:good" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "png" | "jpg";
  aspectRatio?: string;
  blur?: number;
  dpr?: number | "auto";
}

import manifestData from "./cloudinary-manifest.json";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "pyrugvo3";
const CLOUDINARY_BASE = "https://res.cloudinary.com";
// Generated during container preparation after CDN availability checks.
// Missing objects retain local originals and must not become broken CDN URLs.
const LOCAL_ASSETS = new Set<string>(JSON.parse(process.env.NEXT_PUBLIC_CLOUDINARY_LOCAL_ASSETS || "[]"));

const manifest = manifestData as Record<
  string,
  { public_id: string; secure_url: string; format?: string }
>;

/**
 * Membentuk URL Cloudinary teroptimasi dari path atau public_id gambar.
 * Jika gambar berupa file SVG atau URL eksternal, dikembalikan langsung.
 */
export function getCloudinaryUrl(
  imagePath: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!imagePath) return "/images/common/placeholder.png";

  // 1. Aset SVG & Vektor tetap disajikan lokal (Hybrid Strategy)
  if (imagePath.toLowerCase().endsWith(".svg")) {
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  }

  // Existing uploaded assets retain their own cloud, version, and crop chain.
  // Append display transforms before the version/public ID instead of treating
  // existing transformations as part of a public ID in our default cloud.
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    try {
      const url = new URL(imagePath);
      if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") return imagePath;
      const segments = url.pathname.split("/");
      const upload = segments.indexOf("upload");
      if (upload < 0 || segments[upload - 1] !== "image" || segments[upload + 1]?.startsWith("s--")) return imagePath;
      let asset = upload + 1;
      while (segments[asset] && /^(?:[a-z]{1,4}_[^/]+)(?:,[a-z]{1,4}_[^/]+)*$/.test(segments[asset]) && !/^v\d+$/.test(segments[asset])) asset++;
      const transforms = [`f_${options.format || "auto"}`, `q_${options.quality || "auto:good"}`];
      if (options.width) transforms.push(`w_${options.width}`);
      if (options.height) transforms.push(`h_${options.height}`);
      if (options.crop) transforms.push(`c_${options.crop}`);
      if (options.gravity) transforms.push(`g_${options.gravity}`);
      if (options.aspectRatio) transforms.push(`ar_${options.aspectRatio}`);
      if (options.blur) transforms.push(`e_blur:${options.blur}`);
      if (options.dpr) transforms.push(`dpr_${options.dpr}`);
      segments.splice(asset, 0, transforms.join(","));
      url.pathname = segments.join("/");
      return url.toString();
    } catch { return imagePath; }
  }

  // 3. Fallback jika CLOUD_NAME belum dikonfigurasi
  if (!CLOUD_NAME) {
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  }

  // 4. Periksa apakah aset terdaftar di manifest hasil sinkronisasi
  const relKey = imagePath.replace(/^\/+/, "").replace(/^images\//, "");
  if (LOCAL_ASSETS.has(relKey) || relKey.includes("hero-student-k3")) return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  const manifestItem = manifest[relKey];

  let targetPublicId = "";
  if (manifestItem && manifestItem.public_id) {
    targetPublicId = manifestItem.public_id;
  } else if (imagePath.includes("res.cloudinary.com")) {
    // Jika sudah berupa URL Cloudinary (misal dari database admin)
    const match = imagePath.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (match && match[1]) {
      targetPublicId = match[1];
    } else {
      return imagePath;
    }
  } else {
    // Fallback: Jika tidak ada di manifest dan belum di cloud, gunakan path lokal agar tidak 404
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  }

  // 5. Susun parameter transformasi
  const transforms: string[] = [];

  // Format & Kualitas Default (Otomatis AVIF/WebP)
  const format = options.format || "auto";
  const quality = options.quality || "auto:good";
  transforms.push(`f_${format}`, `q_${quality}`);

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.aspectRatio) transforms.push(`ar_${options.aspectRatio}`);
  if (options.blur) transforms.push(`e_blur:${options.blur}`);
  if (options.dpr) transforms.push(`dpr_${options.dpr}`);

  const transformStr = transforms.join(",");

  return `${CLOUDINARY_BASE}/${CLOUD_NAME}/image/upload/${transformStr}/${targetPublicId}`;
}

/**
 * Helper khusus untuk foto guru & tenaga pendidik.
 * Menggunakan smart crop dengan fokus deteksi wajah (`g_face`).
 */
export function getTeacherPhotoUrl(
  rawPath: string,
  width: number = 320,
  height: number = 400
): string {
  return getCloudinaryUrl(rawPath, {
    width,
    height,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Helper khusus thumbnail berita/artikel sekolah.
 * Menggunakan rasio 16:9 dengan responsive fit.
 */
export function getNewsImageUrl(
  rawPath: string,
  width: number = 720,
  height: number = 405
): string {
  return getCloudinaryUrl(rawPath, {
    width,
    height,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Helper banner hero beranda dan jurusan.
 */
export function getHeroImageUrl(rawPath: string, width: number = 1920): string {
  return getCloudinaryUrl(rawPath, {
    width,
    quality: "auto:good",
    format: "auto",
  });
}
