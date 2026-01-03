import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get the authenticated user's account details
 *     tags:
 *       - Accounts
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 account:
 *                   $ref: '#/components/schemas/Account'
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const GET = async (req: NextRequest) => {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
  const account = await prisma.account.findUnique({
    where: {
      id: (decoded as { id: string }).id,
    },
    include: {
      user: true,
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ account }, { status: 200 });
};
