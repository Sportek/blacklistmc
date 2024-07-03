"use client";

import { DiscordCallbackResponse } from "@/app/api/auth/callback/discord/discord-helper";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const DiscordCallback = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      redirect("/");
    }

    const exchangeCodeForToken = async () => {
      try {
        const response = await fetch("/api/auth/callback/discord?code=" + code);
        if (!response.ok) {
          throw new Error("Failed to exchange code for token");
        }
        const data: DiscordCallbackResponse = await response.json();
        localStorage.setItem("token", data.token);
        redirect("/");
      } catch (error) {
        console.log(error);
        redirect("/");
      }
    };

    exchangeCodeForToken();
  }, []);

  return <div>DiscordCallback</div>;
};

export default DiscordCallback;
