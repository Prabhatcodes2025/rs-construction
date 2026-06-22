import { isAdmin } from "@/lib/security";
import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > 8_000_000) return NextResponse.json({ error: "Use a valid image under 8MB." }, { status: 400 });
  const ext = (file.name.split(".").pop() || "webp").replace(/[^a-z0-9]/gi,"");
  const name = `${Date.now()}-${crypto.randomUUID().slice(0,8)}.${ext}`;
  const dir = path.join(process.cwd(),"public","uploads"); await fs.mkdir(dir,{recursive:true});
  await fs.writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ path:`/uploads/${name}` });
}
