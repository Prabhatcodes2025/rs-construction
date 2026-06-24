import { addLead } from "@/lib/store";
import { captchaFallbackEnabled, captchaProvider, verifyTextCaptcha } from "@/lib/captcha";
import { verifyRecaptcha } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name?.trim() || !/^[0-9+\-\s]{8,16}$/.test(body.mobile || "")) return NextResponse.json({ error: "Please provide a valid name and mobile number." }, { status: 400 });
  const useTextCaptcha = body.captchaProvider === "text" && (captchaProvider() === "text" || captchaFallbackEnabled());
  const captcha = useTextCaptcha ? verifyTextCaptcha(body.captchaToken, body.captchaAnswer) : await verifyRecaptcha(body.captchaToken);
  if (!captcha.success) return NextResponse.json({ error: captcha.error || "reCAPTCHA verification failed." }, { status: 400 });
  try {
    const lead = await addLead({ source: body.source || "Website", name: body.name.trim(), mobile: body.mobile.trim(), email: body.email?.trim(), location: body.location?.trim(), plotSize: body.plotSize?.trim(), service: body.service?.trim(), message: body.message?.trim() });
    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "We could not save your enquiry. Please call or WhatsApp us." }, { status: 503 });
  }
}
