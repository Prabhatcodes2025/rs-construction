import { del, put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const mediaBucket = () => process.env.SUPABASE_MEDIA_BUCKET?.trim() || "site-media";
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN));
const supabaseConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, ""),
  key: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
});

export type StoredMedia = { path: string; provider: "supabase" | "vercel-blob" | "local" };

function encodedObjectPath(objectPath: string) {
  return objectPath.split("/").map(encodeURIComponent).join("/");
}

function supabaseHeaders(key: string, contentType = "application/json") {
  return { apikey: key, Authorization: `Bearer ${key}`, "content-type": contentType };
}

async function ensureSupabaseBucket(url: string, key: string) {
  const bucket = mediaBucket();
  const check = await fetch(`${url}/storage/v1/bucket/${encodeURIComponent(bucket)}`, {
    headers: supabaseHeaders(key), cache: "no-store",
  });
  if (check.ok) return;
  if (check.status !== 404) throw new Error(`Unable to access the Supabase media bucket (${check.status}).`);
  const create = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: supabaseHeaders(key),
    body: JSON.stringify({
      id: bucket,
      name: bucket,
      public: true,
      file_size_limit: MAX_IMAGE_BYTES,
      allowed_mime_types: [...ALLOWED_IMAGE_TYPES],
    }),
  });
  if (!create.ok && create.status !== 409) {
    throw new Error(`Unable to create the Supabase media bucket (${create.status}).`);
  }
}

export function managedMediaProvider() {
  const supabase = supabaseConfig();
  if (supabase.url && supabase.key) return "Supabase Storage";
  if (hasBlob()) return "Vercel Blob";
  if (!process.env.VERCEL) return "Local development storage";
  return "Not configured";
}

export async function storeImage(bytes: Uint8Array, objectPath: string, contentType: string): Promise<StoredMedia> {
  const body = Buffer.from(bytes);
  const supabase = supabaseConfig();
  if (supabase.url && supabase.key) {
    await ensureSupabaseBucket(supabase.url, supabase.key);
    const bucket = mediaBucket();
    const upload = await fetch(`${supabase.url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedObjectPath(objectPath)}`, {
      method: "POST",
      headers: { ...supabaseHeaders(supabase.key, contentType), "x-upsert": "false" },
      body,
    });
    if (!upload.ok) throw new Error(`Supabase Storage upload failed (${upload.status}).`);
    return {
      path: `${supabase.url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedObjectPath(objectPath)}`,
      provider: "supabase",
    };
  }

  if (hasBlob()) {
    const blob = await put(`rs-construction/${objectPath}`, body, {
      access: "public", addRandomSuffix: false, contentType,
    });
    return { path: blob.url, provider: "vercel-blob" };
  }

  if (process.env.VERCEL) throw new Error("Media storage is not configured. Connect Supabase Storage or Vercel Blob.");
  const relative = objectPath.replace(/^uploads\//, "");
  const directory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, relative), bytes);
  return { path: `/uploads/${relative}`, provider: "local" };
}

export function collectManagedMedia(value: unknown, urls = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    if (value.startsWith("/uploads/") || value.includes("/storage/v1/object/public/") || value.includes(".public.blob.vercel-storage.com/")) urls.add(value);
    return urls;
  }
  if (Array.isArray(value)) value.forEach(item => collectManagedMedia(item, urls));
  else if (value && typeof value === "object") Object.values(value as Record<string, unknown>).forEach(item => collectManagedMedia(item, urls));
  return urls;
}

export async function deleteManagedMedia(mediaUrl: string) {
  const supabase = supabaseConfig();
  if (supabase.url && supabase.key && mediaUrl.startsWith(`${supabase.url}/storage/v1/object/public/`)) {
    const marker = `/storage/v1/object/public/${mediaBucket()}/`;
    const index = mediaUrl.indexOf(marker);
    if (index < 0) return;
    const objectPath = mediaUrl.slice(index + marker.length).split("?")[0];
    const response = await fetch(`${supabase.url}/storage/v1/object/${encodeURIComponent(mediaBucket())}/${objectPath}`, {
      method: "DELETE", headers: supabaseHeaders(supabase.key),
    });
    if (!response.ok && response.status !== 404) throw new Error(`Unable to remove replaced Supabase media (${response.status}).`);
    return;
  }
  if (mediaUrl.includes(".public.blob.vercel-storage.com/") && hasBlob()) {
    await del(mediaUrl);
    return;
  }
  if (mediaUrl.startsWith("/uploads/") && !process.env.VERCEL) {
    const filename = path.basename(mediaUrl);
    await fs.unlink(path.join(process.cwd(), "public", "uploads", filename)).catch(error => {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    });
  }
}
