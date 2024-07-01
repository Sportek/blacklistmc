import prisma from "@/lib/prisma";
import { retrieveBufferFromAzure } from "@/utils/file-upload-manager";
import { NextRequest, NextResponse } from "next/server";
interface UserBlacklistProofParams {
  params: {
    userId: string;
    blacklistId: string;
    proofId: string;
  };
}

/**
 * @swagger
 * /api/users/{userId}/blacklists/{blacklistId}/proofs/{proofId}:
 *   get:
 *     summary: Get a proof
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
 *         description: The proof
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
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

  const readableStream = await retrieveBufferFromAzure(proof.url);

  if (!readableStream) {
    return NextResponse.json({ error: "Proof not found" }, { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      readableStream.on("data", (chunk) => controller.enqueue(chunk));
      readableStream.on("end", () => controller.close());
      readableStream.on("error", (err) => controller.error(err));
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${proof.url.split("/").pop()}"`,
    },
  });
}
