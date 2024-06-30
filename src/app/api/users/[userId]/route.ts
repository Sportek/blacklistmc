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
 *         type: string
 *         description: The discord id of the user
 *     responses:
 *       200:
 *         description: The user
 *       500:
 *         description: Error while fetching user
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
 *         type: string
 *         description: The discord id of the user
 *     responses:
 *       200:
 *         description: The user
 *       500:
 *         description: Error while deleting user
 */
export async function DELETE(req: NextRequest, { params }: UsersIdParams) {
  await prisma.user.delete({ where: { id: params.userId } });
  return NextResponse.json({ message: "User deleted" });
}
