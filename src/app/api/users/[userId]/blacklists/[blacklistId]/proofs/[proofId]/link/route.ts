import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { getTemporaryBlobUrlWithSasToken } from "@/utils/file-upload-manager";
import { AccountRole } from "@prisma/client";
import { NextRequest } from "next/server";

interface LinkRequestParams {
  params: {
    userId: string;
    blacklistId: string;
    proofId: string;
  };
}

/**
 * @swagger
 * /api/users/{userId}/blacklists/{blacklistId}/proofs/{proofId}/link:
 *   get:
 *     summary: Get temporary signed URL for proof
 *     tags:
 *       - Proofs
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The discord id of the user
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
 *         description: Temporary signed URL for the proof
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
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
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
export async function GET(request: NextRequest, { params }: LinkRequestParams) {
  try {
    const proof = await prisma.proof.findUnique({
      where: {
        id: params.proofId,
      },
    });

    if (!proof) {
      return Response.json({ error: "Proof not found" }, { status: 404 });
    }

    if (proof.isPublic) {
      const url = await getTemporaryBlobUrlWithSasToken(proof.url, 1);
      return Response.json({ url });
    }

    await verifyRoleRequired(AccountRole.SUPPORT, request);

    const url = await getTemporaryBlobUrlWithSasToken(proof.url, 1);
    return Response.json({ url });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
