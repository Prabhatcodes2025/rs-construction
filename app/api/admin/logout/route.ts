import { sessionCookie } from "@/lib/security";
import { NextResponse } from "next/server";
export async function POST() { const response = NextResponse.json({ success: true }); response.cookies.set(sessionCookie, "", { maxAge: 0, path: "/" }); return response; }
