import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/reasons:
 *   get:
 *     summary: Get all reasons
 *     tags:
 *       - Reasons
 *     parameters:
 *       - name: query
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: The query to search for reasons
 *     responses:
 *       200:
 *         description: A list of reasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Reason"
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
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") ?? "";

  const reasons = await prisma.reason.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
  });

  return NextResponse.json(reasons);
}

/**
 * @swagger
 * /api/reasons:
 *   post:
 *     summary: Create a new reason
 *     tags:
 *       - Reasons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the reason
 *     responses:
 *       200:
 *         description: The created reason
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reason"
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
export async function POST(request: NextRequest) {
  try {
    verifyRoleRequired(AccountRole.ADMIN, request);
    const { name } = await request.json();
    const reason = await prisma.reason.create({
      data: {
        name,
      },
    });
    return Response.json(reason);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

