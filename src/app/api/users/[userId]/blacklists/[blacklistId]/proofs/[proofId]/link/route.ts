import { AuthorizationError, verifyRoleRequired } from "@/lib/authorizer";
import prisma from "@/lib/prisma";
import { getTemporaryBlobUrlWithSasToken } from "@/utils/file-upload-manager";
import { AccountRole } from "@prisma/client";
import { NextRequest } from "next/server";

interface LinkRequestParams {
  params: {
    userId: string;
    blacklistId: string;
    proofId: string;
  };
}
export async function GET(request: NextRequest, { params }: LinkRequestParams) {
  try {
    const proof = await prisma.proof.findUnique({
      where: {
        id: params.proofId,
      },
    });

    if (!proof) {
      return Response.json({ error: "Proof not found" }, { status: 404 });
    }

    if (proof.isPublic) {
      const url = await getTemporaryBlobUrlWithSasToken(proof.url, 1);
      return Response.json({ url });
    }

    await verifyRoleRequired(AccountRole.SUPPORT, request);

    const url = await getTemporaryBlobUrlWithSasToken(proof.url, 1);
    return Response.json({ url });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
