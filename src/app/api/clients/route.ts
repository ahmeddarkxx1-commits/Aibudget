import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SUPABASE_URL = "https://uqsyxkudalvftvfdxzik.supabase.co";
const getKey = () => process.env.SUPABASE_ANON_KEY || "sb_publishable_NV2xLEFkv2J8xTcWOlRsog_9K5PSlX8";

async function sbGet(table: string, query: string = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    headers: { "apikey": getKey(), "Authorization": `Bearer ${getKey()}` },
  });
  return res.json();
}

async function sbPost(table: string, data: any) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": getKey(),
      "Authorization": `Bearer ${getKey()}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function sbDelete(table: string, query: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method: "DELETE",
    headers: { "apikey": getKey(), "Authorization": `Bearer ${getKey()}` },
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "admin-001";
  const clients = await sbGet("Client", `?userId=eq.${userId}&order=createdAt.desc`);
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "admin-001";
  const data = await req.json();
  const res = await sbPost("Client", { ...data, userId, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  return NextResponse.json(res);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await sbDelete("Client", `?id=eq.${id}`);
  return NextResponse.json({ success: true });
}
