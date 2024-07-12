"use client";

import Card from "@/components/landing/card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const TokensPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetch("/api/auth/token")
      .then((res) => res.json())
      .then((data) => {
        setToken(data.token);
        setIsLoading(false);
      });
  }, []);

  const handleCopy = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setIsCopied(true);
    }
  };

  // Faire un truc pour pas tout l'afficher et pour pouvoir cliquer et le copier
  return (
    <div>
 
        <div className="w-full flex flex-col gap-2 items-center overflow-y-auto h-screen pt-8 px-2">
          <div className="max-w-3xl w-full flex flex-col gap-4">
            <div className="text-2xl font-semibold w-full">Token nécessaire pour les requêtes avec un bot</div>
            <Card className="flex flex-col gap-2">
              {isLoading ? (
                <p>Chargement...</p>
              ) : (
                <>
                  <div className="truncate">{token}</div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300",
                      isCopied ? "bg-green-500 hover:bg-green-700" : ""
                    )}
                  >
                    {isCopied ? "Copié !" : "Copier"}
                  </button>
                </>
              )}
            </Card>
          </div>
      </div>
    </div>
  );
};

export default TokensPage;
