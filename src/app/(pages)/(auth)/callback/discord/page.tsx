"use client";

import { DiscordCallbackResponse } from "@/app/api/auth/callback/discord/discord-helper";
import BaseSpacing from "@/components/base";
import { useAuth } from "@/contexts/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DiscordCallback = () => {
  const router = useRouter();
  const { checkAuthetification, saveToken } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) router.push("/");

    const exchangeCodeForToken = async () => {
      try {
        const response = await fetch("/api/auth/callback/discord?code=" + code);
        if (!response.ok) throw new Error("Failed to exchange code for token");
        const data: DiscordCallbackResponse = await response.json();
        saveToken(data.token);
        await checkAuthetification();
        router.push("/");
      } catch (error) {
        console.log(error);
        router.push("/");
      }
    };

    exchangeCodeForToken();
  }, [router, saveToken, checkAuthetification]);

  return (
    <BaseSpacing>
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-2xl font-bold">Redirection en cours...</h1>
        <p className="text-sm text-gray-500">
          Si vous n&apos;êtes pas redirigé automatiquement, cliquez <Link href="/">ici</Link>
        </p>
      </div>
    </BaseSpacing>
  );
};

export default DiscordCallback;
