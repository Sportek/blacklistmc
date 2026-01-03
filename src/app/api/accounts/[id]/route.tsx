import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { AccountRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { updateAccountValidator } from "./accountValidator";

interface AccountParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, props: AccountParams) {
  const params = await props.params;
  const account = await prisma.account.findUnique({
    where: {
      userId: params.id,
    },
  });

  return NextResponse.json(account);
}

export async function PATCH(req: NextRequest, props: AccountParams) {
  const params = await props.params;
  try {
    verifyRoleRequired(AccountRole.ADMIN, req);
    const body = await req.json();
    const { role } = updateAccountValidator.parse(body);

    const account = await prisma.account.update({
      where: {
        userId: params.id,
      },
      data: {
        role: role as AccountRole,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
  }
}
