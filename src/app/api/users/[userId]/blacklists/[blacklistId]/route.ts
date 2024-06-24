import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface UsersUserIdBlacklistsBlacklistIdParams {
  params: {
    userId: string;
    blacklistId: string;
  };
}

export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const blacklist = await prisma.blacklist.findUnique({ where: { id: params.blacklistId } });
  return Response.json(blacklist, { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  await prisma.blacklist.delete({ where: { id: params.blacklistId } });
  return Response.json(null, { status: 204 });
}

export async function PATCH(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const { reason } = await req.json();
  await prisma.blacklist.update({ where: { id: params.blacklistId }, data: { reason } });
  return Response.json(null, { status: 200 });
}
