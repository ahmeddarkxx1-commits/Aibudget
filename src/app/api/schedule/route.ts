import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SUPABASE_URL = "https://uqsyxkudalvftvfdxzik.supabase.co";
const getKey = () => process.env.SUPABASE_ANON_KEY || "sb_publishable_NV2xLEFkv2J8xTcWOlRsog_9K5PSlX8";

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
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method: "DELETE",
    headers: {
      "apikey": getKey(),
      "Authorization": `Bearer ${getKey()}`,
    },
  });
  return res.ok;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "admin-001";
    const data = await req.json();

    const result = await sbPost("Schedule", {
      ...data,
      userId,
      id: crypto.randomUUID(),
      startTime: data.startTime || new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID required");

    await sbDelete("Schedule", `?id=eq.${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
