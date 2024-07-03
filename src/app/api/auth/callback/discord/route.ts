import { updateOrCreateUserInfo } from "@/http/discord-requests";
import prisma from "@/lib/prisma";
import { Account } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  global_name: string;
  email: string;
}

export interface DiscordToken {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordCallbackResponse {
  user: DiscordUser;
  token: DiscordToken;
}

export const createAccountIfNotExist = async (user: DiscordUser) => {
  await updateOrCreateUserInfo(user.id);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      account: true,
    },
  });

  if (!existingUser?.account) {
    await prisma.account.create({
      data: {
        email: user.email,
        role: "USER",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
};

export const generateJWT = (account: Account, expiresIn: string) => {
  return jwt.sign({ id: account.id }, process.env.JWT_SECRET, { expiresIn });
};

export const GET = async (req: NextRequest, res: NextResponse) => {
  const code = req.nextUrl.searchParams.get("code");

  if (!code || Array.isArray(code)) {
    return NextResponse.json({ error: "Code not found" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append("client_id", process.env.AUTH_DISCORD_ID);
  params.append("client_secret", process.env.AUTH_DISCORD_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.AUTH_DISCORD_REDIRECT_URI);

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

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

    const token = generateJWT(account, "30d");

    return NextResponse.json({ user: userData, token }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
