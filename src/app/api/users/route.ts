import { NextRequest, NextResponse } from "next/server";

import { updateOrCreateUserInfo } from "@/http/discord-requests";
import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { userSchema } from "./userSchema";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of users to return
 *       - name: random
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to return the users in random order
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: The search query
 *     responses:
 *       200:
 *         description: The users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error while getting users
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const random = searchParams.get("random") === "true";
  const page = parseInt(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";

  const skip = (page - 1) * limit;

  let users: User[] = [];
  if (random) {
    users = await prisma.$queryRaw`SELECT * FROM "User" WHERE "displayName" ILIKE ${`%${search}%`} ORDER BY RANDOM()`;
  } else {
    users = await prisma.user.findMany({
      where: {
        OR: [
          {
            id: {
              startsWith: search,
              mode: "insensitive",
            },
          },
          {
            displayName: {
              startsWith: search,
              mode: "insensitive",
            },
          },
          {
            username: {
              startsWith: search,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  }

  const paginatedUsers = users.slice(skip, skip + limit);

  return NextResponse.json(paginatedUsers);
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The id of the user
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: Invalid request or User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Error while creating user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(req: NextRequest) {
  try {
    await verifyRoleRequired(AccountRole.ADMIN, req);
    const body = await req.json();
    const { id } = userSchema.parse(body);
    const userInfo = await updateOrCreateUserInfo(id);

    return NextResponse.json(userInfo);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }
    }
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error.message === "Too Many Requests") {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
