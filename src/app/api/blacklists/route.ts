import { getSession, hasAtLeastRole } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole, Blacklist, BlacklistStatus } from "@/prisma/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { searchParamsSchema } from "./blacklistSearchParamsValidator";

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
 *       - name: random
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true, returns random blacklists
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: The search term for filtering blacklists by username or display name
 *     responses:
 *       200:
 *         description: The blacklists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Blacklist"
 *       500:
 *         description: Error while fetching blacklists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error while fetching blacklists
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const parsedParams = searchParamsSchema.safeParse(Object.fromEntries(searchParams.entries()));
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 });
  }

  const { limit, order, random, page, search, status } = parsedParams.data;

  const session = await getSession(req);

  if((!session || !hasAtLeastRole(AccountRole.SUPPORT, session.role)) && status !== "APPROVED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skip = (page - 1) * limit;

  try {
    let blacklists: Blacklist[] = [];

    if (random) {
      blacklists =
        await prisma.$queryRaw`SELECT * FROM "Blacklist" WHERE "user"."username" ILIKE ${`%${search}%`} OR "user"."displayName" ILIKE ${`%${search}%`} ORDER BY RANDOM()`;
    } else {
      blacklists = await prisma.blacklist.findMany({
        where: {
          status: status as BlacklistStatus,
          OR: [
            {
              user: {
                username: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              user: {
                displayName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: order === "asc" ? "asc" : "desc",
        },
        include: {
          user: true,
          votes: true,
          reason: true,
          _count: {
            select: {
              votes: true,
            },
          },
          proofs: true,
        },
      });
    }

    return NextResponse.json(blacklists);
  } catch (error) {
    return NextResponse.json({ error: "Error while fetching blacklists" });
  }
}
