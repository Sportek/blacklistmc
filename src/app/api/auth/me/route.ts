import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
  const account = await prisma.account.findUnique({
    where: {
      id: (decoded as { id: string }).id,
    },
    include: {
      user: true,
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ account }, { status: 200 });
};
