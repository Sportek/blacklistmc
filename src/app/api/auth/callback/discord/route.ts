import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createAccountIfNotExist, generateJWT } from "./discord-helper";

/**
 * @swagger
 * /api/auth/callback/discord:
 *   get:
 *     summary: Get user account details via Discord OAuth2 code
 *     tags:
 *       - Accounts
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The authorization code returned by Discord OAuth2
 *     responses:
 *       200:
 *         description: Successfully retrieved user information and generated JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/DiscordUser'
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid request or errors during OAuth2 process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const GET = async (req: NextRequest, res: NextResponse) => {
  const code = req.nextUrl.searchParams.get("code");

  if (!code || Array.isArray(code)) {
    return NextResponse.json({ error: "Code not found" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.NEXT_PUBLIC_AUTH_DISCORD_ID);
  params.append("client_secret", process.env.AUTH_DISCORD_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.NEXT_PUBLIC_AUTH_DISCORD_REDIRECT_URI);

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch token data" }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 400 });
    }

    const userData = await userResponse.json();

    await createAccountIfNotExist(userData);

    const account = await prisma.account.findUnique({
      where: {
        userId: userData.id,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 400 });
    }

    const token = generateJWT(account, "WEB", "30d");

    const response = NextResponse.json({ user: userData, token }, { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
