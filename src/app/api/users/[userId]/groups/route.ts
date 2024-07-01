import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface UserUserIdGroupParams {
  params: {
    userId: string;
  };
}

export async function GET(req: NextRequest, { params }: UserUserIdGroupParams) {
  const { userId } = params;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
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

export async function POST(req: NextRequest, { params }: UserUserIdGroupParams) {
  const { userId } = params;
  const { secondUserId } = await req.json();

  if (!userId || !secondUserId) {
    return Response.json({ error: "User IDs are required" }, { status: 400 });
  }

  try {
    const result = await mergeGroups(userId, secondUserId);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: UserUserIdGroupParams) {
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
}
