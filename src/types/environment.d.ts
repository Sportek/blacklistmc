// Typage

export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AZURE_STORAGE_CONTAINER_NAME: string;
      AZURE_STORAGE_CONNECTION_STRING: string;
      AZURE_STORAGE_ACCOUNT_NAME: string;
      AZURE_STORAGE_ACCOUNT_KEY: string;
      AUTH_SECRET: string;
      AUTH_DISCORD_ID: string;
      AUTH_DISCORD_SECRET: string;
      AUTH_DISCORD_REDIRECT_URI: string;
    }
  }
}
