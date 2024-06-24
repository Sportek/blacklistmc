import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await prisma.user.findUnique({ where: { discordId: id } });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { status } = await req.json();
  const user = await prisma.user.update({ where: { discordId: id }, data: { status } });
  return NextResponse.json(user);
}

export async function DELETE({ params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.user.delete({ where: { discordId: id } });
  return NextResponse.json({ message: "User deleted" });
}
