import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
interface UserBlacklistProofParams {
  params: {
    blacklistId: string;
    proofId: string;
  };
}

/**
 * @swagger
 * /api/blacklists/{blacklistId}/proofs/{proofId}:
 *   get:
 *     summary: Get a proof
 *     tags:
 *       - Proofs
 *     parameters:
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *       - name: proofId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the proof
 *     responses:
 *       200:
 *         description: The proof
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 isPublic:
 *                   type: boolean
 *       404:
 *         description: Proof not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Proof not found
 *       500:
 *         description: Error while fetching proof
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error while fetching proof
 */
export async function GET(req: NextRequest, { params }: UserBlacklistProofParams) {
  const { blacklistId, proofId } = params;
  const proof = await prisma.proof.findUnique({
    where: {
      id: proofId,
      blacklistId: Number(blacklistId),
    },
  });

  if (!proof) {
    return NextResponse.json({ error: "Proof not found" }, { status: 404 });
  }

  return NextResponse.json(proof);
}

/**
 * @swagger
 * /api/blacklists/{blacklistId}/proofs/{proofId}:
 *   put:
 *     summary: Update a proof
 *     tags:
 *       - Proofs
 *     parameters:
 *       - name: blacklistId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the blacklist
 *       - name: proofId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the proof
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPublic:
 *                 type: boolean
 *             required:
 *               - isPublic
 *     responses:
 *       200:
 *         description: The updated proof
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 isPublic:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       400:
 *         description: isPublic is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: isPublic is required
 *       404:
 *         description: Proof not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Proof not found
 *       500:
 *         description: Error while updating proof
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error while updating proof
 */
export async function PUT(req: NextRequest, { params }: UserBlacklistProofParams) {
  try {
    const { proofId } = params;

    await verifyRoleRequired(AccountRole.SUPPORT, req);

    const { isPublic } = await req.json();

    if (typeof isPublic !== "boolean") {
      return NextResponse.json({ error: "isPublic is required" }, { status: 400 });
    }

    const proof = await prisma.proof.update({
      where: {
        id: proofId,
      },
      data: {
        isPublic,
      },
    });

    if (!proof) {
      return NextResponse.json({ error: "Proof not found" }, { status: 404 });
    }

    return NextResponse.json(proof);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Error while updating proof" }, { status: 500 });
  }
}
