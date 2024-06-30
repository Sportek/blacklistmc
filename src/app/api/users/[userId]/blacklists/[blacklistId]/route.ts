import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface UsersUserIdBlacklistsBlacklistIdParams {
  params: {
    userId: string;
    blacklistId: string;
  };
}

/**
 * @swagger
 * /api/users/{userId}/blacklists/{blacklistId}:
 *   get:
 *     summary: Get a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The discord id of the user
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         type: string
 *         description: The id of the blacklist
 *     responses:
 *       200:
 *         description: The blacklist
 *       500:
 *         description: Error while fetching blacklist
 */
export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const blacklist = await prisma.blacklist.findUnique({ where: { id: Number(params.blacklistId) } });
  return Response.json(blacklist, { status: 200 });
}

/**
 * @swagger
 * /api/users/{userId}/blacklists/{blacklistId}:
 *   delete:
 *     summary: Delete a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The discord id of the user
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         type: string
 *         description: The id of the blacklist
 *     responses:
 *       200:
 *         description: The blacklist
 *       500:
 *         description: Error while deleting blacklist
 */
export async function DELETE(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  await prisma.blacklist.delete({ where: { id: Number(params.blacklistId) } });
  return Response.json(null, { status: 204 });
}

/**
 * @swagger
 * /api/users/{userId}/blacklists/{blacklistId}:
 *   patch:
 *     summary: Update a blacklist
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The discord id of the user
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         type: string
 *         description: The id of the blacklist
 *       - name: title
 *         in: body
 *         required: true
 *         type: string
 *         description: The title of the blacklist
 *       - name: description
 *         in: body
 *         required: true
 *         type: string
 *         description: The description of the blacklist
 *       - name: isFinalized
 *         in: body
 *         required: true
 *         type: boolean
 *         description: The finalized status of the blacklist
 *     responses:
 *       200:
 *         description: The blacklist
 *       500:
 *         description: Error while updating blacklist
 */
export async function PATCH(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const { title, description, isFinalized } = await req.json();
  const updatedBlacklist = await prisma.blacklist.update({
    where: { id: Number(params.blacklistId) },
    data: { title, description, isFinalized },
  });
  return Response.json(updatedBlacklist, { status: 200 });
}
