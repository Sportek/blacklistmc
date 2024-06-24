import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
import { userSchema } from "./userSchema";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

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
