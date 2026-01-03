import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole } from "@/prisma/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface DeleteReasonRequest {
  params: Promise<{
    id: string;
  }>;
}

/**
 * @swagger
 * /api/reasons/{reasonId}:
 *   delete:
 *     summary: Delete a reason
 *     tags:
 *       - Reasons
 *     parameters:
 *       - in: path
 *         name: reasonId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reason to be deleted
 *     responses:
 *       200:
 *         description: Reason deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reason deleted
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
export async function DELETE(request: NextRequest, props: DeleteReasonRequest) {
  const params = await props.params;
  try {
    verifyRoleRequired(AccountRole.ADMIN, request);
    await prisma.reason.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Reason deleted" });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
