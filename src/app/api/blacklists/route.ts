import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/blacklists:
 *   get:
 *     summary: Get all blacklists
 *     tags:
 *       - Blacklists
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of blacklists to return
 *       - name: order
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: The order of the blacklists
 *     responses:
 *       200:
 *         description: The blacklists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   expireAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   isFinalized:
 *                     type: boolean
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       displayName:
 *                         type: string
 *                       username:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                   votes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         blacklistId:
 *                           type: integer
 *                         moderatorId:
 *                           type: string
 *                         vote:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                   _count:
 *                     type: object
 *                     properties:
 *                       votes:
 *                         type: integer
 *                   proofs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         isPublic:
 *                           type: boolean
 *                         type:
 *                           type: string
 *                           enum: [VIDEO, IMAGE, FILE]
 *                         url:
 *                           type: string
 *                         blacklistId:
 *                           type: integer
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       500:
 *         description: Error while fetching blacklists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") ?? "10";
  const order = searchParams.get("order") ?? "desc";

  try {
    const blacklists = await prisma.blacklist.findMany({
      take: parseInt(limit),
      orderBy: {
        createdAt: order === "asc" ? "asc" : "desc",
      },
      include: {
        user: true,
        votes: true,
        _count: {
          select: {
            votes: true,
          },
        },
        proofs: true,
      },
    });
    return NextResponse.json(blacklists);
  } catch (error) {
    return NextResponse.json({ error: "Error while fetching blacklists" });
  }
}
