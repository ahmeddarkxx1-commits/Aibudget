import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true, project: true },
      orderBy: { date: "desc" }
    });

    const headers = "Date,Description,Category,Type,Amount,Project\n";
    const rows = transactions.map(tx => {
      return `${tx.date.toISOString()},"${tx.description || ""}","${tx.category?.name || ""}","${tx.type}",${tx.amount},"${tx.project?.name || ""}"`;
    }).join("\n");

    const csv = headers + rows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="transactions.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
