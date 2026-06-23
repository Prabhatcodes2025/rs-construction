import { isAdmin } from "@/lib/security";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 8_000_000) return NextResponse.json({ error: "Use a valid image under 8MB." }, { status: 400 });
  const ext = (file.name.split(".").pop() || "webp").replace(/[^a-z0-9]/gi,"");
  const name = `${Date.now()}-${crypto.randomUUID().slice(0,8)}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)) {
    const blob = await put(`rs-construction/uploads/${name}`, file, { access: "public", addRandomSuffix: false, contentType: file.type });
    return NextResponse.json({ path: blob.url });
  }
  if (process.env.VERCEL) return NextResponse.json({ error: "Connect Vercel Blob before uploading images." }, { status: 503 });
  const dir = path.join(process.cwd(),"public","uploads"); await fs.mkdir(dir,{recursive:true});
  await fs.writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ path:`/uploads/${name}` });
}
