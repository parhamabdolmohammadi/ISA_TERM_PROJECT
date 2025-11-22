import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  // 1️⃣ Get BetterAuth session from headers
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  // No session → no user logged in
  if (!session?.user?.id) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // 2️⃣ Fetch full user from Prisma (including role)
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,       // 👈 Important
      createdAt: true,
    },
  });

  if (!dbUser) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // 3️⃣ Return enriched user data
  return NextResponse.json(
    {
      user: dbUser,
    },
    { status: 200 }
  );
}
