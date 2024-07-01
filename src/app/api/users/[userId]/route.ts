import { updateOrCreateUserInfo } from "@/http/discord-requests";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UsersIdParams {
  params: {
    userId: string;
  };
}

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get a user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The discord id of the user
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       500:
 *         description: Error while fetching user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(req: NextRequest, { params }: UsersIdParams) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  return NextResponse.json(user);
}

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The discord id of the user
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted
 *       500:
 *         description: Error while deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function DELETE(req: NextRequest, { params }: UsersIdParams) {
  await prisma.user.delete({ where: { id: params.userId } });
  return NextResponse.json({ message: "User deleted" });
}

/**
 * @swagger
 * /api/users/{userId}:
 *   post:
 *     summary: Update or create user info
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The discord id of the user
 *     responses:
 *       200:
 *         description: User info updated or created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       500:
 *         description: Error while updating or creating user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest, { params }: UsersIdParams) {
  const userInfo = await updateOrCreateUserInfo(params.userId);
  return NextResponse.json(userInfo);
}
