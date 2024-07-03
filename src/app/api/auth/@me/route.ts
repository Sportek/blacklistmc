import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
  const account = await prisma.account.findUnique({
    where: {
      id: decoded.id,
    },
    include: {
      user: true,
    },
  });

  if (!account) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ account, user: account.user });
};
