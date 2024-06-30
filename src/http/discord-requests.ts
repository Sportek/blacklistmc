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
