import prisma from "@/lib/prisma";
import { UserStatus } from "@/types/types";
import { Blacklist, BlacklistStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface UserUserIdStatusParams {
  params: {
    userId: string;
  };
}

const getStatus = (activeBlacklists: Blacklist[], hasOldBlacklists: boolean) => {
  let status;

  if (activeBlacklists.length > 0) {
    status = UserStatus.BLACKLISTED;
  } else if (hasOldBlacklists) {
    status = UserStatus.OLD_BLACKLISTED;
  } else {
    status = UserStatus.NOT_BLACKLISTED;
  }

  return status;
};

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
 *         schema:
 *           type: string
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
 *                   enum: [NOT_BLACKLISTED, BLACKLISTED, OLD_BLACKLISTED]
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
export async function GET(req: NextRequest, { params }: UserUserIdStatusParams) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      Blacklist: {
        where: {
          status: BlacklistStatus.APPROVED,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const activeBlacklists = user.Blacklist.filter((blacklist) => {
    return !blacklist.expireAt || blacklist.expireAt > new Date();
  });

  const hasOldBlacklists = user.Blacklist.length > 0 && activeBlacklists.length === 0;

  return NextResponse.json({
    status: getStatus(activeBlacklists, hasOldBlacklists),
  });
}
