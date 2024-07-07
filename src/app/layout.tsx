import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/useAuth";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";

const gabarito = Gabarito({ subsets: ["latin"], preload: true, display: "swap" });

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
    <AuthProvider>
      <html lang="fr">
        <body
          className={cn(
            "bg-background antialiased text-white h-full min-h-screen w-full flex flex-col items-center overflow-x-clip",
            gabarito.className
          )}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
