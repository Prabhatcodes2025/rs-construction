import { getSiteData } from "@/lib/store";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await getSiteData()); }
