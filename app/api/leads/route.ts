import { addLead } from "@/lib/store";
import { captchaFallbackEnabled, captchaProvider, verifyTextCaptcha } from "@/lib/captcha";
import { verifyRecaptcha } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid enquiry data." }, { status: 400 });
  const text = (value: unknown, max = 2000) => typeof value === "string" ? value.trim().slice(0, max) : "";
  const name = text(body.name, 100);
  const mobile = text(body.mobile, 16);
  const email = text(body.email, 160);
  const source = text(body.source, 100) || "Website";
  if (!name || !/^[0-9+\-\s]{8,16}$/.test(mobile)) return NextResponse.json({ error: "Please provide a valid name and mobile number." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });

  let details: Record<string, string> | undefined;
  if (source === "RS Interiors Scope Planner") {
    const submitted = body.details && typeof body.details === "object" ? body.details as Record<string, unknown> : {};
    details = {
      propertyType: text(submitted.propertyType, 80),
      bedrooms: text(submitted.bedrooms, 20),
      kitchenType: text(submitted.kitchenType, 80),
      interiorPackage: text(submitted.interiorPackage, 80),
      requiredSpaces: text(submitted.requiredSpaces, 120),
      propertyLocation: text(submitted.propertyLocation, 160),
      carpetArea: text(submitted.carpetArea, 20),
      additionalMessage: text(submitted.additionalMessage),
    };
    const required = [details.propertyType, details.bedrooms, details.kitchenType, details.interiorPackage, details.requiredSpaces, details.propertyLocation, details.carpetArea];
    if (!email || required.some(value => !value) || body.consent !== true || !/^\d{3,7}$/.test(details.carpetArea) || Number(details.carpetArea) < 100) {
      return NextResponse.json({ error: "Please complete all required planner fields and consent to contact." }, { status: 400 });
    }
  }
  const useTextCaptcha = body.captchaProvider === "text" && (captchaProvider() === "text" || captchaFallbackEnabled());
  const captchaToken = text(body.captchaToken, 4096);
  const captcha = useTextCaptcha ? verifyTextCaptcha(captchaToken, body.captchaAnswer) : await verifyRecaptcha(captchaToken);
  if (!captcha.success) return NextResponse.json({ error: captcha.error || "reCAPTCHA verification failed." }, { status: 400 });
  try {
    const message = details ? [
      `Property Type: ${details.propertyType}`,
      `Number of Bedrooms: ${details.bedrooms}`,
      `Kitchen Type: ${details.kitchenType}`,
      `Interior Package: ${details.interiorPackage}`,
      `Required Spaces: ${details.requiredSpaces}`,
      `Property Location: ${details.propertyLocation}`,
      `Carpet Area: ${details.carpetArea} sq.ft`,
      `Additional Message: ${details.additionalMessage || "Not provided"}`,
    ].join("\n") : text(body.message);
    const lead = await addLead({ source, name, mobile, email: email || undefined, location: text(body.location, 160) || undefined, plotSize: text(body.plotSize, 100) || undefined, service: text(body.service, 120) || undefined, message: message || undefined, details });
    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "We could not save your enquiry. Please call or WhatsApp us." }, { status: 503 });
  }
}
