import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const stats = await prisma.endpointStat.findMany({
    orderBy: { count: "desc" },
  });

  return NextResponse.json(stats);
}
