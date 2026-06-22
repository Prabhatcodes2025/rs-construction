import { createSession, sessionCookie, verifyRecaptcha } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, captchaToken } = await request.json();
  if (!await verifyRecaptcha(captchaToken)) return NextResponse.json({ error: "Verification failed." }, { status: 400 });
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) return NextResponse.json({ error: "Admin environment variables are not configured." }, { status: 503 });
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookie, createSession(email), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 28800, path: "/" });
  return response;
}
