import { isAdmin } from "@/lib/security";
import { getLeads } from "@/lib/store";
import { NextResponse } from "next/server";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const leads = await getLeads();
  const cols = ["createdAt","source","status","name","mobile","email","location","plotSize","service","message"];
  const escape = (v: unknown) => `"${String(v ?? "").replaceAll('"','""')}"`;
  const csv = [cols.join(","), ...leads.map(row => cols.map(key => escape(row[key as keyof typeof row])).join(","))].join("\n");
  return new NextResponse(csv, { headers: { "content-type": "text/csv", "content-disposition": 'attachment; filename="rs-construction-enquiries.csv"' } });
}
