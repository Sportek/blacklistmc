import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
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
 *       - name: discordId
 *         in: body
 *         required: true
 *         type: string
 *         description: The discord id of the user
 *       - name: status
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ "TRUSTED", "BLACKLISTED", "UNKNOWN" ]
 *         description: The status of the user
 *       - name: imageUrl
 *         in: body
 *         required: true
 *         type: string
 *         description: The image url of the user
 *       - name: displayName
 *         in: body
 *         required: true
 *         type: string
 *         description: The display name of the user
 *       - name: username
 *         in: body
 *         required: true
 *         type: string
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: The user
 *       500:
 *         description: Error while creating user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { discordId, status, imageUrl, displayName, username } = userSchema.parse(body);

    const user = await prisma.user.create({
      data: {
        discordId,
        imageUrl,
        displayName,
        username,
        status: status as UserStatus,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
