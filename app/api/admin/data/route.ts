import { isAdmin } from "@/lib/security";
import { getLeads, getSiteData, saveLeads, saveSiteData, storageStatus } from "@/lib/store";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ site: await getSiteData(), leads: await getLeads(), storage: storageStatus() });
}
export async function PUT(request: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  try {
    if (body.site) await saveSiteData(body.site);
    if (body.leads) await saveLeads(body.leads);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save changes." }, { status: 503 });
  }
}
