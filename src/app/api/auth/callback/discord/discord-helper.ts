import { updateOrCreateUserInfo } from "@/http/discord-requests";
import prisma from "@/lib/prisma";
import { Account } from "@prisma/client";
import jwt from "jsonwebtoken";

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
  token: string;
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

export type JWTType = "WEB" | "API";

export const generateJWT = (account: Account, type: JWTType, expiresIn: string | undefined = undefined) => {
  return jwt.sign({ id: account.id, type }, process.env.JWT_SECRET, { expiresIn });
};
