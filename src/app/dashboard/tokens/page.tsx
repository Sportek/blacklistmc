"use client";

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
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="truncate max-w-xl">{token}</span>
          <button
            onClick={handleCopy}
            className={cn(
              "px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300",
              isCopied ? "bg-green-500 hover:bg-green-700" : ""
            )}
          >
            {isCopied ? "Copié !" : "Copier"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TokensPage;
