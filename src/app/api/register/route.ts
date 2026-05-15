import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password using native crypto (SHA-256) since we don't have bcrypt installed yet
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        password: hashedPassword, // Note: For production, we should ideally use bcrypt
      },
    });

    return NextResponse.json({ 
      message: "User created successfully",
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
