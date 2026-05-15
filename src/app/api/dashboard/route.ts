import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SUPABASE_URL = "https://uqsyxkudalvftvfdxzik.supabase.co";
const getKey = () => process.env.SUPABASE_ANON_KEY || "sb_publishable_NV2xLEFkv2J8xTcWOlRsog_9K5PSlX8";

async function sbGet(table: string, query: string = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    headers: {
      "apikey": getKey(),
      "Authorization": `Bearer ${getKey()}`,
    },
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "admin-001";
    const anonKey = getKey();

    // Fetch User Settings (Currency, Salary)
    const users = await sbGet("User", `?id=eq.${userId}&select=currency,salary`);
    const userData = users[0] || { currency: "EGP", salary: 0 };

    // Fetch transactions
    const transactions = await sbGet(
      "Transaction",
      `?userId=eq.${userId}&order=createdAt.desc&limit=20&select=*,category:Category(*)`
    );

    const income = transactions
      .filter((t: any) => t.type === "INCOME")
      .reduce((sum: number, t: any) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter((t: any) => t.type === "EXPENSE")
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    // Fetch schedules/tasks
    const schedules = await sbGet(
      "Schedule",
      `?userId=eq.${userId}&order=startTime.asc&limit=10`
    );

    // Build chart data
    const monthMap: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach((t: any) => {
      const month = new Date(t.createdAt || t.date).toLocaleString("en", { month: "short" });
      if (!monthMap[month]) monthMap[month] = { income: 0, expenses: 0 };
      if (t.type === "INCOME") monthMap[month].income += t.amount;
      else monthMap[month].expenses += t.amount;
    });

    const chartData = Object.entries(monthMap).map(([name, v]) => ({ name, ...v }));

    return NextResponse.json({
      transactions,
      schedules,
      user: userData,
      stats: {
        balance: income - expenses,
        income,
        expenses,
        profit: income - expenses,
        salary: userData.salary
      },
      chartData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add new transaction from Web
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "admin-001";
    const data = await req.json();

    const result = await sbPost("Transaction", {
      ...data,
      userId,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete transaction
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID required");

    await sbDelete("Transaction", `?id=eq.${id}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
