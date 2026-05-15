import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sbGet, sbPost, sbDelete, sbPatch } from "@/lib/telegram";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // Remove filter temporarily to see if projects exist
    const projects = await sbGet("Project"); 
    return NextResponse.json(Array.isArray(projects) ? projects : []);
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || "admin-001";
    const data = await req.json();
    const res = await sbPost("Project", { 
      ...data, 
      userId, 
      id: crypto.randomUUID(), 
      createdAt: new Date().toISOString() 
    });
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();
    if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });
    const res = await sbPatch("Project", `id=eq.${id}`, data);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });
    const res = await sbDelete("Project", `id=eq.${id}`);
    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
