import { createTextCaptchaChallenge } from "@/lib/captcha";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(createTextCaptchaChallenge(), { headers: { "cache-control": "no-store" } });
}
