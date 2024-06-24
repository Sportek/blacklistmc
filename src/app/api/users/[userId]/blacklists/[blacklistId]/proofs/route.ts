import prisma from "@/lib/prisma";
import { uploadFileToAzure } from "@/utils/file-upload-manager";
import { NextRequest } from "next/server";
import path from "path";

interface UsersUserIdBlacklistsBlacklistIdProofsParams {
  params: {
    userId: string;
    blacklistId: string;
  };
}

export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const blacklist = await prisma.blacklist.findUnique({ where: { id: params.blacklistId } });
  if (!blacklist) {
    return new Response("Blacklist not found", { status: 404 });
  }

  const proofs = await prisma.proof.findMany({ where: { blacklistId: params.blacklistId } });
  return new Response(JSON.stringify(proofs), { status: 200 });
}

export async function POST(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  const blacklist = await prisma.blacklist.findUnique({ where: { id: params.blacklistId } });
  if (!blacklist) {
    return new Response("Blacklist not found", { status: 404 });
  }

  try {
    const fileName = await uploadFileToAzure(req, path.join(params.userId, params.blacklistId, "proofs"));
    return new Response(`File ${fileName} uploaded successfully`, { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}
