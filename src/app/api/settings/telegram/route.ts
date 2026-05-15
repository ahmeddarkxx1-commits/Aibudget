import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SUPABASE_URL = "https://uqsyxkudalvftvfdxzik.supabase.co";
const getKey = () => process.env.SUPABASE_ANON_KEY || "sb_publishable_NV2xLEFkv2J8xTcWOlRsog_9K5PSlX8";

async function sbGet(table: string, query: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    headers: { "apikey": getKey(), "Authorization": `Bearer ${getKey()}` },
  });
  if (!res.ok) return [];
  return res.json();
}

async function sbPost(table: string, data: any) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": getKey(),
      "Authorization": `Bearer ${getKey()}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation,resolution=merge-duplicates",
    },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return JSON.parse(text);
}

async function sbPatch(table: string, query: string, data: any) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method: "PATCH",
    headers: {
      "apikey": getKey(),
      "Authorization": `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}

// GET - load current settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "admin-001";

    // Get telegram ID
    const telegramAccounts = await sbGet("TelegramAccount", `?userId=eq.${userId}&limit=1`);
    const telegramId = telegramAccounts?.[0]?.telegramId || "";

    // Get user settings
    const users = await sbGet("User", `?id=eq.${userId}&limit=1`);
    const user = users?.[0];

    return NextResponse.json({
      telegramId,
      currency: user?.currency || "EGP",
      salary: user?.salary || 0,
      name: user?.name || session?.user?.name || "Ahmed",
      email: user?.email || session?.user?.email || "",
    });
  } catch (e: any) {
    return NextResponse.json({ telegramId: "", currency: "EGP", name: "", email: "" });
  }
}

// POST - save settings
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "admin-001";
    const { telegramId, currency, name, salary } = await req.json();

    // Save Telegram ID if provided
    if (telegramId) {
      // Check if already exists
      const existing = await sbGet("TelegramAccount", `?userId=eq.${userId}&limit=1`);
      if (existing && existing.length > 0) {
        await sbPatch("TelegramAccount", `?userId=eq.${userId}`, { telegramId });
      } else {
        await sbPost("TelegramAccount", {
          id: crypto.randomUUID(),
          telegramId,
          userId,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Save currency, name, and salary
    if (currency || name || salary !== undefined) {
      await sbPatch("User", `?id=eq.${userId}`, {
        ...(currency && { currency }),
        ...(name && { name }),
        ...(salary !== undefined && { salary: parseFloat(salary) }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
