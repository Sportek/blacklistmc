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
    return new Response("User not found", { status: 404 });
  }

  const blacklists = await prisma.blacklist.findMany({ where: { userId: user.id } });
  return new Response(JSON.stringify(blacklists), { status: 200 });
}

export async function POST(req: NextRequest, { params }: UsersUserIdBlacklistsParams) {
  const { userId, moderatorId, reason } = await req.json();
  const validated = createBlacklistSchema.safeParse({ userId, moderatorId, reason });
  if (!validated.success) {
    return new Response("Invalid data", { status: 400 });
  }

  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    return new Response("User not found", { status: 404 });
  }

  const moderatorExists = await prisma.user.findUnique({ where: { id: moderatorId } });
  if (!moderatorExists) {
    return new Response("Moderator not found", { status: 404 });
  }

  const blacklist = await prisma.blacklist.create({
    data: {
      reason,
      user: {
        connect: { id: userId },
      },
      moderator: {
        connect: { id: moderatorId },
      },
    },
  });

  return new Response(JSON.stringify(blacklist), { status: 201 });
}
