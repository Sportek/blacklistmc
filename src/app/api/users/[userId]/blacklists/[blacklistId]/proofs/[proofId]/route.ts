import prisma from "@/lib/prisma";
import { retrieveBufferFromAzure } from "@/utils/file-upload-manager";
import { NextRequest, NextResponse } from "next/server";
interface UserBlacklistProofParams {
  params: {
    userId: string;
    blacklistId: string;
    proofId: string;
  };
}
export async function GET(req: NextRequest, { params }: UserBlacklistProofParams) {
  const { userId, blacklistId, proofId } = params;
  const proof = await prisma.proof.findUnique({
    where: {
      id: proofId,
      blacklistId: blacklistId,
    },
  });

  if (!proof) {
    return NextResponse.json({ error: "Proof not found" }, { status: 404 });
  }

  const readableStream = await retrieveBufferFromAzure(proof.url);

  if (!readableStream) {
    return NextResponse.json({ error: "Proof not found" }, { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      readableStream.on("data", (chunk) => controller.enqueue(chunk));
      readableStream.on("end", () => controller.close());
      readableStream.on("error", (err) => controller.error(err));
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${proof.url.split("/").pop()}"`,
    },
  });
}
