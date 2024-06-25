import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (query === null) {
    return new Response("Query is required", { status: 400 });
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
