import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sbGet, sbPatch } from "@/lib/telegram";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "admin-001";
  const user = await sbGet("User", `id=eq.${userId}&limit=1`);
  return NextResponse.json(user[0] || {});
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "admin-001";
  const data = await req.json();
  
  // Update bot_name in User table
  const res = await sbPatch("User", `id=eq.${userId}`, {
    bot_name: data.botName
  });
  
  return NextResponse.json(res);
}
