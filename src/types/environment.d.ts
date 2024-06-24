// Typage

export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AZURE_STORAGE_CONTAINER_NAME: string;
      AZURE_STORAGE_CONNECTION_STRING: string;
      AUTH_SECRET: string;
      AUTH_DISCORD_ID: string;
      AUTH_DISCORD_SECRET: string;
    }
  }
}
