import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/research:
 *   get:
 *     summary: Search users based on query parameter
 *     tags:
 *       - Users
 *     parameters:
 *       - name: query
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: The search query to filter users
 *     responses:
 *       200:
 *         description: List of matched users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   displayName:
 *                     type: string
 *                   username:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (query === null || query === "") {
    return NextResponse.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          id: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          displayName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return NextResponse.json(users);
}
