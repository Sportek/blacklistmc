import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const user = await prisma.user.findUnique({ where: { discordId: id } });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const { status } = await req.json();
  const user = await prisma.user.update({ where: { discordId: id }, data: { status } });
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  await prisma.user.delete({ where: { discordId: id } });
  return NextResponse.json({ message: "User deleted" });
}
