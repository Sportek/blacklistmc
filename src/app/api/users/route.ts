import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { discordId, username, status } = await req.json();
  const user = await prisma.user.create({
    data: {
      discordId,
      username,
      status,
    },
  });
  return NextResponse.json(user);
}
