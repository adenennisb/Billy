import { writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/svg+xml", "image/webp"]);

// Vercel's serverless functions run on a read-only filesystem, so we can't
// persist uploads there. Until we wire up Vercel Blob, accept the file but
// store nothing (returning null tells the caller to skip setting logoPath).
function isReadOnlyFs() {
  return process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
}

export async function saveLogo(file: File): Promise<string | null> {
  if (!ALLOWED.has(file.type)) throw new Error("Unsupported image type");
  if (file.size > MAX_BYTES) throw new Error("Logo must be 2 MB or smaller");
  if (isReadOnlyFs()) return null;
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = extname(file.name) || mimeToExt(file.type);
  const filename = `${randomBytes(8).toString("hex")}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(join(UPLOAD_DIR, filename), buf);
  return `/uploads/${filename}`;
}

function mimeToExt(m: string) {
  switch (m) {
    case "image/png": return ".png";
    case "image/jpeg": return ".jpg";
    case "image/svg+xml": return ".svg";
    case "image/webp": return ".webp";
    default: return "";
  }
}
