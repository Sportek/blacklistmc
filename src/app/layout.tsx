import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const gabarito = Gabarito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | BlacklistMC",
    default: "BlacklistMC",
  },
  description:
    "BlacklistMC centralise les blacklists Minecraft pour une gestion simplifiée des bannissements. Des modérateurs expérimentés garantissent des sanctions justes et efficaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={cn("bg-background font-sans antialiased text-white", gabarito.className)}>
        {children}
      </body>
    </html>
  );
}
