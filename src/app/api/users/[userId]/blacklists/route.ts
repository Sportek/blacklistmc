import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { createBlacklistSchema } from "./blacklistSchema";

interface UsersUserIdBlacklistsParams {
  params: {
    userId: string;
  };
}

/**
 * @swagger
 * /api/users/{userId}/blacklists:
 *   get:
 *     summary: Get all blacklists for a user
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The discord id of the user
 *     responses:
 *       200:
 *         description: The blacklists
 *       500:
 *         description: Error while fetching blacklists
 */
export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const blacklists = await prisma.blacklist.findMany({ where: { userId: user.id } });
  return Response.json(blacklists, { status: 200 });
}

/**
 * @swagger
 * /api/users/{userId}/blacklists:
 *   post:
 *     summary: Create a new blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The discord id of the user
 *       - name: moderatorId
 *         in: body
 *         required: true
 *         type: string
 *         description: The discord id of the moderator
 *       - name: reason
 *         in: body
 *         required: true
 *         type: string
 *         description: The reason for the blacklist
 *     responses:
 *       200:
 *         description: The blacklist
 *       500:
 *         description: Error while creating blacklist
 */
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
