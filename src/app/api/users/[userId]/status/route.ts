import prisma from "@/lib/prisma";
import { UserStatus } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

interface UserUserIdStatusParams {
  params: {
    userId: string;
  };
}

/**
 * @swagger
 * /api/users/{userId}/status:
 *   get:
 *     summary: Get the status of a user
 *     description: Get the status of a user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: The status of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [UNKNOWN, BLACKLISTED]
 *       404:
 *         description: User not found
 */
export async function GET(req: NextRequest, { params }: UserUserIdStatusParams) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      Blacklist: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const blacklist = user.Blacklist.filter((blacklist) => {
    return !blacklist.blacklistUntil || blacklist.blacklistUntil > new Date();
  });

  return NextResponse.json({
    status: blacklist.length > 0 ? UserStatus.BLACKLISTED : UserStatus.UNKNOWN,
  });
}
