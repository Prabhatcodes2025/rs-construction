import { adminCredentials, createSession, sessionCookie, verifyRecaptcha } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, captchaToken } = await request.json();
  if (!await verifyRecaptcha(captchaToken)) return NextResponse.json({ error: "Verification failed." }, { status: 400 });
  const credentials = adminCredentials();
  if (email !== credentials.username || password !== credentials.password) return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookie, createSession(email), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 28800, path: "/" });
  return response;
}
