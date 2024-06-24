import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UsersIdParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: UsersIdParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.id } });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: UsersIdParams) {
  const { status } = await req.json();
  const user = await prisma.user.update({ where: { discordId: params.id }, data: { status } });
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest, { params }: UsersIdParams) {
  await prisma.user.delete({ where: { discordId: params.id } });
  return NextResponse.json({ message: "User deleted" });
}
