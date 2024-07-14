import prisma from "@/lib/prisma";
import { uploadBufferToAzure } from "@/utils/file-upload-manager";
import path from "path";

const DISCORD_API_URL = process.env.DISCORD_API_URL;
const TOKEN = process.env.DISCORD_TOKEN;

export interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: null;
  accent_color: number;
  global_name: string;
  avatar_decoration_data: string;
  banner_color: string;
  clan: string;
}

export const getUserInfo = async (userId: string): Promise<UserInfo> => {
  try {
    const response = await fetch(`${DISCORD_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bot ${TOKEN}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      if (response.status === 429) {
        throw new Error("Too Many Requests");
      }
      console.log(await response.json());
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }

    const data = await response.json();
    return data as UserInfo;
  } catch (error) {
    throw error;
  }
};

export const getBufferFromImageUrl = async (url: string): Promise<Buffer> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

export const getCreationDateFromDiscordID = async (discordId: string): Promise<Date> => {
  const discordEpoch = 1420070400000;
  const binary = BigInt(discordId).toString(2).padStart(64, "0");
  const timestamp = parseInt(binary.substring(0, 42), 2);
  return new Date(timestamp + discordEpoch);
};

interface UserData {
  username: string;
  avatar: string;
  global_name: string;
}
export const areUserInfoDifferent = (oldUserInfo: UserData, newUserInfo: UserData) => {
  const displayName = newUserInfo.global_name || newUserInfo.username;
  const oldDisplayName = oldUserInfo.global_name || oldUserInfo.username;

  return (
    oldUserInfo.username !== newUserInfo.username ||
    oldUserInfo.avatar !== newUserInfo.avatar ||
    oldDisplayName !== displayName
  );
};

export const setUserInfo = async (userId: string, userInfo: UserInfo) => {
  const imageUrl = await uploadBufferToAzure(
    await getBufferFromImageUrl(`https://cdn.discordapp.com/avatars/${userId}/${userInfo.avatar}.png`),
    path.posix.join("users", userId, "avatars", `${Date.now()}.png`),
    true
  );

  const oldUser = await prisma.user.findUnique({ where: { id: userId } });
  let user;
  if (!oldUser) {
    user = await prisma.user.create({
      data: {
        id: userId,
        displayName: userInfo.global_name || userInfo.username,
        username: userInfo.username,
        imageTag: userInfo.avatar,
        imageUrl: imageUrl,
      },
    });
  } else if (
    areUserInfoDifferent(
      { username: oldUser.username, avatar: oldUser.imageTag, global_name: oldUser.displayName },
      { username: userInfo.username, avatar: userInfo.avatar, global_name: userInfo.global_name }
    )
  ) {
    const history = await prisma.userHistory.create({
      data: {
        userId: oldUser.id,
        displayName: oldUser.displayName,
        username: oldUser.username,
        imageUrl: oldUser.imageUrl,
      },
    });

    user = await prisma.user.update({
      where: { id: userId },
      data: {
        username: userInfo.username,
        imageTag: userInfo.avatar,
        displayName: userInfo.global_name || userInfo.username,
        imageUrl: imageUrl,
        UserHistory: {
          connect: {
            id: history.id,
          },
        },
      },
      include: {
        UserHistory: true,
      },
    });
  } else {
    user = oldUser;
  }

  return user;
};

export const updateOrCreateUserInfo = async (userId: string) => {
  const userInfo = await getUserInfo(userId);
  return await setUserInfo(userId, userInfo);
};
