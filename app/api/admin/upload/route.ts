import { isAdmin } from "@/lib/security";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, storeImage } from "@/lib/media-storage";
import { NextRequest, NextResponse } from "next/server";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function safeBaseName(filename: string) {
  return filename.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase().slice(0, 60) || "image";
}

function signatureMatches(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

export async function POST(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Your admin session has expired. Please sign in again." }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
      return NextResponse.json({ error: "Unsupported file type. Upload a JPG, JPEG, PNG, or WebP image." }, { status: 415 });
    }
    if (file.size <= 0) return NextResponse.json({ error: "The selected image is empty." }, { status: 400 });
    if (file.size > MAX_IMAGE_BYTES) return NextResponse.json({ error: "Image is too large. Maximum size is 6 MB." }, { status: 413 });

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!signatureMatches(bytes, file.type)) return NextResponse.json({ error: "The file contents do not match a valid image." }, { status: 415 });
    const filename = `${safeBaseName(file.name)}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extensions[file.type]}`;
    const stored = await storeImage(bytes, `uploads/${filename}`, file.type);
    return NextResponse.json({ path: stored.path, provider: stored.provider }, { status: 201 });
  } catch (error) {
    console.error("Admin image upload failed", { message: error instanceof Error ? error.message : "Unknown error" });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Image upload failed. Please try again." }, { status: 503 });
  }
}
