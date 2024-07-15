"use client";

import Card from "@/components/landing/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ArrowPathIcon, FlagIcon } from "@heroicons/react/24/solid";
import { Reason } from "@prisma/client";
import { useRef, useState } from "react";

interface AddReasonProps {
  onAdd: (reason: Reason) => void;
}
const AddReason = ({ onAdd }: AddReasonProps) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddReason = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reasons", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).error);
      }
      const data = await response.json();
      onAdd(data); // Appeler la fonction onAdd avec la nouvelle raison
      toast({
        title: "Motif ajouté",
        description: "Motif ajouté avec succès",
        variant: "default",
      });
      setName("");
    } catch (error: any) {
      toast({
        title: "Echec de l'ajout du motif",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-row gap-2 items-center">
      <FlagIcon className="w-4 h-4" />
      <Input
        className="text-white bg-transparent border-none h-full placeholder:text-white/50"
        type="text"
        placeholder="Motif"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddReason();
          }
        }}
      />
      <Button onClick={handleAddReason} disabled={isLoading}>
        {isLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : "Ajouter"}
      </Button>
    </Card>
  );
};

export default AddReason;
