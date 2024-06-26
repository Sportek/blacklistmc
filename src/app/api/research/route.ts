import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (query === null || query === "") {
    return NextResponse.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          discordId: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          displayName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return NextResponse.json(users);
}
