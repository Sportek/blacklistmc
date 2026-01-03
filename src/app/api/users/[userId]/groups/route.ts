import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface UserUserIdGroupParams {
  params: Promise<{
    userId: string;
  }>;
}

/**
 * @swagger
 * /api/users/{userId}/groups:
 *   get:
 *     summary: Get player's linked accounts
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: The user's group
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserGroup"
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
 */
export async function GET(req: NextRequest, props: UserUserIdGroupParams) {
  const params = await props.params;
  const { userId } = params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      group: {
        include: {
          users: true,
        },
      },
    },
  });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  return Response.json(user.group);
}

/**
 * @swagger
 * /api/users/{userId}/groups:
 *   post:
 *     summary: Merge user accounts
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               secondUserId:
 *                 type: string
 *                 description: ID of the second user
 *     responses:
 *       200:
 *         description: Groups merged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest, props: UserUserIdGroupParams) {
  const params = await props.params;
  try {
    verifyRoleRequired(AccountRole.ADMIN, req);

    const { userId } = params;
    const { secondUserId } = await req.json();

    if (!userId || !secondUserId) {
      return Response.json({ error: "User IDs are required" }, { status: 400 });
    }
    const result = await mergeGroups(userId, secondUserId);
    return Response.json(result);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users/{userId}/groups:
 *   delete:
 *     summary: Remove player from account group
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User removed from group or group deleted if empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User removed from group
 *       404:
 *         description: User not found or doesn't belong to a group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function DELETE(req: NextRequest, props: UserUserIdGroupParams) {
  const params = await props.params;
  try {
    verifyRoleRequired(AccountRole.ADMIN, req);

    const { userId } = params;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return Response.json({ error: "User not found" }, { status: 404 });
    if (!user.groupId) return Response.json({ error: "User does not belong to a group" }, { status: 404 });

    const groupId = user.groupId;
    await prisma.user.update({
      where: { id: userId },
      data: { groupId: null },
    });

    const groupMembers = await prisma.user.findMany({
      where: { groupId },
    });

    if (groupMembers.length === 0) {
      await prisma.userGroup.delete({ where: { id: groupId } });
      return Response.json({ message: "Group deleted" });
    }

    return Response.json({ message: "User removed from group" });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
  }
}

// Helper functions remain same as previously defined
async function findUserById(userId: string) {
  return prisma.user.findUnique({ where: { id: userId } });
}

async function createNewGroup(userIds: string[]) {
  return prisma.userGroup.create({
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
}

async function addUsersToGroup(groupId: string, userIds: string[]) {
  return prisma.userGroup.update({
    where: { id: groupId },
    data: {
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
}

async function mergeGroups(userId1: string, userId2: string) {
  const [user1, user2] = await Promise.all([findUserById(userId1), findUserById(userId2)]);
  const user1GroupId = user1?.groupId;
  const user2GroupId = user2?.groupId;

  if (!user1GroupId && !user2GroupId) {
    return createNewGroup([userId1, userId2]);
  }

  if (user1GroupId && !user2GroupId) {
    return addUsersToGroup(user1GroupId, [userId2]);
  }

  if (!user1GroupId && user2GroupId) {
    return addUsersToGroup(user2GroupId, [userId1]);
  }

  if (user1GroupId !== user2GroupId) {
    await prisma.$transaction(async (prisma) => {
      const group2Users = await prisma.user.findMany({
        where: { groupId: user2GroupId },
      });
      const user2Ids = group2Users.map((user) => user.id);
      await addUsersToGroup(String(user1GroupId), user2Ids);
      await prisma.userGroup.delete({ where: { id: String(user2GroupId) } });
    });

    return { message: "Groups merged successfully" };
  }

  return { message: "Users are already in the same group" };
}
