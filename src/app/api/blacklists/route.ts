import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") ?? "10";
  const order = searchParams.get("order") ?? "desc";
  console.log("Data", limit, order);

  try {
    const blacklists = await prisma.blacklist.findMany({
      take: parseInt(limit),
      orderBy: {
        createdAt: order === "asc" ? "asc" : "desc",
      },
      include: {
        user: true,
        votes: true,
        _count: {
          select: {
            votes: true,
          },
        },
        proofs: true,
      },
    });
    return NextResponse.json(blacklists);
  } catch (error) {
    return NextResponse.json({ error: "Error while fetching blacklists" });
  }
}
