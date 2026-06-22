import { addLead } from "@/lib/store";
import { verifyRecaptcha } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name?.trim() || !/^[0-9+\-\s]{8,16}$/.test(body.mobile || "")) return NextResponse.json({ error: "Please provide a valid name and mobile number." }, { status: 400 });
  if (!await verifyRecaptcha(body.captchaToken)) return NextResponse.json({ error: "Please complete verification." }, { status: 400 });
  const lead = await addLead({ source: body.source || "Website", name: body.name.trim(), mobile: body.mobile.trim(), email: body.email?.trim(), location: body.location?.trim(), plotSize: body.plotSize?.trim(), service: body.service?.trim(), message: body.message?.trim() });
  return NextResponse.json({ success: true, id: lead.id });
}
