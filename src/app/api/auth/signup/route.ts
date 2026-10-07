import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

/**
 * POST /api/auth/signup
 *
 * Creates a new user account with a hashed password and a persisted role.
 * The role is chosen by the user at signup (STUDENT | ADMIN) and stored
 * in the User table — this drives role-based routing after login.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, institution, targetExam, yearOfStudy } = body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required." },
        { status: 400 }
      );
    }

    if (!["STUDENT", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be STUDENT or ADMIN." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // ── Duplicate check ──────────────────────────────────────────────────────
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // ── Hash password ────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Create user ──────────────────────────────────────────────────────────
    const user = await db.user.create({
      data: {
        name: name || email.split("@")[0],
        email,
        hashedPassword,
        role, // "STUDENT" | "ADMIN"  — persisted to DB
      },
      select: { id: true, email: true, role: true, name: true },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: { id: user.id, email: user.email, role: user.role, name: user.name },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
