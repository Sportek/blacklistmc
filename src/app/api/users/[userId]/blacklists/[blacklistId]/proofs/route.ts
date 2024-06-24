import prisma from "@/lib/prisma";
import { uploadFileToAzure } from "@/utils/file-upload-manager";
import { ProofType } from "@prisma/client";
import { NextRequest } from "next/server";
import path from "path";

interface UsersUserIdBlacklistsBlacklistIdProofsParams {
  params: {
    userId: string;
    blacklistId: string;
  };
}

const getProofType = (fileName: string): ProofType => {
  const extension = path.extname(fileName);
  if (extension === ".png" || extension === ".jpg" || extension === ".jpeg") {
    return "IMAGE";
  }
  if (extension === ".mp4" || extension === ".mov") {
    return "VIDEO";
  }
  return "FILE";
};

export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const blacklist = await prisma.blacklist.findUnique({ where: { id: params.blacklistId } });
  if (!blacklist) {
    return Response.json({ error: "Blacklist not found" }, { status: 404 });
  }

  const proofs = await prisma.proof.findMany({ where: { blacklistId: params.blacklistId } });
  return Response.json(proofs, { status: 200 });
}

export async function POST(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const blacklist = await prisma.blacklist.findUnique({ where: { id: params.blacklistId } });
  if (!blacklist) {
    return Response.json({ error: "Blacklist not found" }, { status: 404 });
  }

  try {
    const fileName = await uploadFileToAzure(
      req,
      path.posix.join("users", params.userId, "blacklists", params.blacklistId, "proofs")
    );
    const proof = await prisma.proof.create({
      data: {
        url: fileName,
        blacklistId: params.blacklistId,
        type: getProofType(fileName),
      },
    });
    return Response.json(proof, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
