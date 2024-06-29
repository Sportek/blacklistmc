import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { createBlacklistSchema } from "./blacklistSchema";

interface UsersUserIdBlacklistsParams {
  params: {
    userId: string;
  };
}

export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const blacklists = await prisma.blacklist.findMany({ where: { userId: user.id } });
  return Response.json(blacklists, { status: 200 });
}

export async function POST(req: NextRequest, { params }: UsersUserIdBlacklistsParams) {
  const { userId, moderatorId, reason } = await req.json();
  const validated = createBlacklistSchema.safeParse({ userId, moderatorId, reason });
  if (!validated.success) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const userExists = await prisma.user.findUnique({ where: { discordId: userId } });
  if (!userExists) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const moderatorExists = await prisma.user.findUnique({ where: { discordId: moderatorId } });
  if (!moderatorExists) {
    return Response.json({ error: "Moderator not found" }, { status: 404 });
  }

  const blacklist = await prisma.blacklist.create({
    data: {
      reason,
      user: {
        connect: { discordId: userId },
      },
    },
  });

  return Response.json(blacklist, { status: 201 });
}
