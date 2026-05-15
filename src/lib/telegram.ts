import { Telegraf } from "telegraf";

// Mapping Telegram IDs to System Users
const KNOWN_TELEGRAM_USERS: Record<string, string> = {
  "1914514519": "admin-001", 
};

const SUPABASE_URL = "https://uqsyxkudalvftvfdxzik.supabase.co";

async function getAnonKey(): Promise<string> {
  return process.env.SUPABASE_ANON_KEY || "sb_publishable_NV2xLEFkv2J8xTcWOlRsog_9K5PSlX8";
}

// 1. DEFINE FUNCTIONS LOCALLY (NO SELF-IMPORT)
export async function sbGet(table: string, query: string = "") {
  const key = await getAnonKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    headers: { "apikey": key, "Authorization": `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase GET Error: ${res.status}`);
  return res.json();
}

export async function sbPost(table: string, data: any) {
  const key = await getAnonKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Supabase POST Error: ${res.status}`);
  return res.json();
}

export async function sbPatch(table: string, query: string, data: any) {
  const key = await getAnonKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Supabase PATCH Error: ${res.status}`);
  return { success: true };
}

export async function sbDelete(table: string, query: string) {
  const key = await getAnonKey();
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase DELETE Error: ${res.status}`);
  return { success: true };
}

// 2. BOT INITIALIZATION
let botInstance: Telegraf | null = null;

const getBot = () => {
  if (botInstance) return botInstance;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return null;

  botInstance = new Telegraf(token);

  botInstance.start(async (ctx) => {
    try {
      const telegramId = ctx.from.id.toString();
      const userId = KNOWN_TELEGRAM_USERS[telegramId] || "admin-001";
      const user = await sbGet("User", `?id=eq.${userId}&limit=1`);
      const botName = user[0]?.bot_name || "CashFlow AI";
      ctx.reply(`أهلاً بك! أنا ${botName} مساعدك المالي الذكي 🤖✨\n\nأنا هنا عشان أظبطلك حساباتك ومواعيدك.. تحب نبدأ بإيه؟`);
    } catch (e) {
      ctx.reply("أهلاً بك! كيف يمكنني مساعدتك اليوم؟");
    }
  });

  botInstance.on("message", async (ctx) => {
    const telegramId = ctx.from.id.toString();
    const userId = KNOWN_TELEGRAM_USERS[telegramId] || "admin-001";
    const text = (ctx as any).message.text;
    if (!text) return;

    try {
      // 1. Check for specific shortcuts first
      if (text === "مصاريفي") {
        const txs = await sbGet("Transaction", `?userId=eq.${userId}&order=createdAt.desc&limit=5`);
        if (txs.length === 0) return ctx.reply("مافيش مصاريف متسجلة يا غالي.");
        
        let msg = "📉 آخر مصاريفك:\n\n";
        txs.forEach((t: any) => {
          const emoji = t.type === "INCOME" ? "💰" : "💸";
          msg += `${emoji} ${t.description}: ${t.amount} EGP\n`;
        });
        return ctx.reply(msg);
      }

      if (text === "المواعيد") {
        const schedules = await sbGet("Schedule", `?userId=eq.${userId}&order=startTime.asc&limit=5`);
        if (schedules.length === 0) return ctx.reply("جدولك فاضي يا بطل.. تحب تسجل ميعاد؟");
        
        let msg = "🗓️ مواعيدك الجاية:\n\n";
        schedules.forEach((s: any) => {
          const time = new Date(s.startTime).toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' });
          msg += `🔹 ${s.title} (الساعة ${time})\n`;
        });
        return ctx.reply(msg);
      }

      // Get Bot Name
      const userResult = await sbGet("User", `?id=eq.${userId}&limit=1`);
      const botName = userResult[0]?.bot_name || "CashFlow AI";

      // AI Parsing
      const openaiModule = await import("./openai");
      const parsed = await openaiModule.parseFinancialInput(text, botName);

      if (parsed.intent === "CHAT") {
        return ctx.reply(parsed.reply);
      }

      if (parsed.intent === "SCHEDULE") {
        await sbPost("Schedule", {
          id: crypto.randomUUID(),
          title: parsed.description,
          startTime: parsed.date || new Date().toISOString(),
          userId
        });
        return ctx.reply(`🗓️ تمام يا غالي، سجلت لك الموعد: "${parsed.description}" في الجدول.`);
      }

      await sbPost("Transaction", {
        id: crypto.randomUUID(),
        amount: parsed.amount,
        type: parsed.type,
        description: parsed.description,
        userId,
        createdAt: new Date().toISOString()
      });

      const emoji = parsed.type === "INCOME" ? "💰" : "📉";
      ctx.reply(`${emoji} تم تسجيل الـ ${parsed.description} بقيمة ${parsed.amount}.. عيوني ليك!`);
      
    } catch (e: any) {
      console.error("Bot Logic Error:", e);
      ctx.reply(`🤖 عذراً، واجهت مشكلة: ${e.message}`);
    }
  });

  return botInstance;
};

export { KNOWN_TELEGRAM_USERS };
export default getBot();
export { getBot };
