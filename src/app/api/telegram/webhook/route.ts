import { NextResponse } from "next/server";
import bot from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Process update through Telegraf
    if (!bot) {
      return NextResponse.json({ ok: false, error: "Bot not configured" }, { status: 503 });
    }
    
    await bot.handleUpdate(body);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// Security: Use a secret path for the webhook
// Example: /api/telegram/webhook/[SECRET_TOKEN]
// For simplicity, we use this direct path but recommend adding a token check.
