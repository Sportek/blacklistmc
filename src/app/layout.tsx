import Footer from "@/components/footer";
import Header from "@/components/header";
import Gradient from "@/components/landing/gradient";
import MultipleOrbit from "@/components/landing/multiple-orbit";
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
    <html lang="fr">
      <body
        className={cn(
          "bg-background antialiased text-white h-full min-h-screen w-full flex flex-col items-center overflow-x-hidden",
          gabarito.className
        )}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0 max-h-[100vh]">
          <MultipleOrbit />
          <Gradient />
        </div>

        {/* Content */}
        <Header />
        <div className="w-full h-full flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
