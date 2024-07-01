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
 *         schema:
 *           type: string
 *         description: The discord id of the user
 *     responses:
 *       200:
 *         description: The blacklists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Blacklist"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Error while fetching blacklists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsParams) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
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
 *         schema:
 *           type: string
 *         description: The discord id of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blacklist
 *               description:
 *                 type: string
 *                 description: The description of the blacklist
 *               askedByUserId:
 *                 type: string
 *                 description: The id of the user who created the blacklist
 *               expireAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: The end date of the blacklist
 *               channelId:
 *                 type: string
 *                 description: The id of the channel related to the blacklist
 *             required:
 *               - title
 *               - description
 *               - askedByUserId
 *     responses:
 *       201:
 *         description: The created blacklist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blacklist"
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *       404:
 *         description: User not found or Asked by user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error while creating blacklist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest, { params }: UsersUserIdBlacklistsParams) {
  const { title, description, askedByUserId, expireAt, channelId } = await req.json();
  console.log(askedByUserId);
  const validated = createBlacklistSchema.safeParse({ title, description, askedByUserId, expireAt, channelId });
  if (!validated.success) {
    const errorMessages = validated.error.flatten().fieldErrors;
    return Response.json({ error: "Invalid data", details: errorMessages }, { status: 400 });
  }

  const userExists = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!userExists) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const askedByUser = await prisma.user.findUnique({ where: { id: askedByUserId } });
  if (!askedByUser) {
    return Response.json({ error: "Asked by user not found" }, { status: 404 });
  }

  const blacklist = await prisma.blacklist.create({
    data: {
      title,
      description,
      askedByUser: { connect: { id: askedByUserId } },
      channelId,
      expireAt: expireAt ? new Date(expireAt) : null,
      user: {
        connect: { id: params.userId },
      },
    },
  });

  return Response.json(blacklist, { status: 201 });
}
