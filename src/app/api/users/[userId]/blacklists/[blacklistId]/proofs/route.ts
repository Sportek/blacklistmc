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

/**
 * @swagger
 * /api/users/{userId}/blacklists/{blacklistId}/proofs:
 *   get:
 *     summary: Get all proofs for a blacklist
 *     tags:
 *       - Proofs
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
 *         description: The proofs
 *       500:
 *         description: Error while fetching proofs
 */
export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const blacklist = await prisma.blacklist.findUnique({ where: { id: Number(params.blacklistId) } });
  if (!blacklist) {
    return Response.json({ error: "Blacklist not found" }, { status: 404 });
  }

  const proofs = await prisma.proof.findMany({ where: { blacklistId: Number(params.blacklistId) } });
  return Response.json(proofs, { status: 200 });
}

/**
 * @swagger
 * /api/users/{userId}/blacklists/{blacklistId}/proofs:
 *   post:
 *     summary: Create a new proof
 *     tags:
 *       - Proofs
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
 *       - name: file
 *         in: body
 *         required: true
 *         type: file
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: The proof
 *       500:
 *         description: Error while creating proof
 */
export async function POST(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const blacklist = await prisma.blacklist.findUnique({ where: { id: Number(params.blacklistId) } });
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
        blacklistId: Number(params.blacklistId),
        type: getProofType(fileName),
      },
    });
    return Response.json(proof, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
