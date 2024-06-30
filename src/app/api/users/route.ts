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
 */
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: body
 *         required: true
 *         type: string
 *         description: The id of the user
 *     responses:
 *       200:
 *         description: The user
 *       500:
 *         description: Error while creating user
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
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
