import { getSession } from "@/lib/authorizer";
import { NextRequest, NextResponse } from "next/server";
import { generateJWT } from "../callback/discord/discord-helper";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const generatedToken = generateJWT(session, "API", "365d");

  return NextResponse.json({ token: generatedToken });
}
