import { NextRequest, NextResponse } from "next/server";

import { getBufferFromImageUrl, getUserInfo } from "@/http/discord-requests";
import prisma from "@/lib/prisma";
import { uploadBufferToAzure } from "@/utils/file-upload-manager";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import path from "path";
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
 *     responses:
 *       200:
 *         description: The users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   account:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
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
 *                   Blacklist:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         userId:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         expireAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                         isFinalized:
 *                           type: boolean
 *                         votes:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               blacklistId:
 *                                 type: integer
 *                               moderatorId:
 *                                 type: string
 *                               vote:
 *                                 type: boolean
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
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
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error while getting users
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const random = searchParams.get("random") === "true" ? true : false;

  let users;
  if (random) {
    users = await prisma.$queryRaw`SELECT * FROM "User" ORDER BY RANDOM() LIMIT ${limit}`;
  } else {
    users = await prisma.user.findMany({
      take: limit,
    });
  }

  return NextResponse.json(users);
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 displayName:
 *                   type: string
 *                 username:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
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
    const body = await req.json();
    const { id } = userSchema.parse(body);
    const userInfo = await getUserInfo(id);

    const imageUrl = await uploadBufferToAzure(
      await getBufferFromImageUrl(`https://cdn.discordapp.com/avatars/${id}/${userInfo.avatar}.png`),
      path.posix.join("users", id, "avatars", `${Date.now()}.png`),
      true
    );

    const user = await prisma.user.create({
      data: {
        id,
        imageUrl,
        displayName: userInfo.global_name || userInfo.username,
        username: userInfo.username,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
