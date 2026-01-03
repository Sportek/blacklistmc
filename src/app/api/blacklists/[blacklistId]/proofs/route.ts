import prisma from "@/lib/prisma";
import { uploadFileToAzure } from "@/utils/file-upload-manager";
import { ProofType } from "@prisma/client";
import { NextRequest } from "next/server";
import path from "path";

interface UsersUserIdBlacklistsBlacklistIdProofsParams {
  params: Promise<{
    blacklistId: string;
  }>;
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
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *     responses:
 *       200:
 *         description: The proofs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Proof"
 *       404:
 *         description: Blacklist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Blacklist not found
 *       500:
 *         description: Error while fetching proofs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(req: NextRequest, props: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const params = await props.params;
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
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: The created proof
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Proof"
 *       404:
 *         description: Blacklist not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error while creating proof
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest, props: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const params = await props.params;
  const blacklist = await prisma.blacklist.findUnique({ where: { id: Number(params.blacklistId) } });
  if (!blacklist) {
    return Response.json({ error: "Blacklist not found" }, { status: 404 });
  }

  try {
    const file = await uploadFileToAzure(
      req,
      path.posix.join("users", blacklist.userId, "blacklists", params.blacklistId, "proofs")
    );

    const proof = await prisma.proof.create({
      data: {
        url: file.filePath,
        name: file.fileName,
        extension: path.extname(file.fileName),
        blacklistId: Number(params.blacklistId),
        type: getProofType(file.fileName),
      },
    });
    return Response.json(proof, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
