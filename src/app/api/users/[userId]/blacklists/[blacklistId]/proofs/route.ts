import prisma from "@/lib/prisma";
import { uploadFileToAzure } from "@/utils/file-upload-manager";
import { NextRequest } from "next/server";

interface UsersUserIdBlacklistsBlacklistIdProofsParams {
  params: {
    userId: string;
    blacklistId: string;
  };
}

export async function GET(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest, { params }: UsersUserIdBlacklistsBlacklistIdProofsParams) {
  const user = await prisma.user.findUnique({ where: { discordId: params.userId } });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  try {
    const fileName = await uploadFileToAzure(req);
    return new Response(`File ${fileName} uploaded successfully`, { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 400 });
  }
}
