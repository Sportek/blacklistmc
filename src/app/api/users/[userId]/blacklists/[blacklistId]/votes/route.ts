import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface VoteParams {
  params: {
    userId: string;
    blacklistId: number;
  };
}
export async function GET(req: NextRequest, { params }: VoteParams) {
  try {
    verifyRoleRequired(AccountRole.SUPPORT, req);

    const blacklist = await prisma.blacklist.findUnique({
      where: {
        id: params.blacklistId,
      },
      include: {
        votes: {
          include: {
            moderator: true,
          },
        },
      },
    });

    if (!blacklist) return NextResponse.json({ error: "Blacklist not found" }, { status: 404 });

    return NextResponse.json(blacklist.votes);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
  }
}
