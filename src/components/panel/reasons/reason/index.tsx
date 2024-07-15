"use client";
import Card from "@/components/landing/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Reason } from "@prisma/client";
import { useState } from "react";

interface ReasonComponentProps {
  reason: Reason;
  onDelete: (id: string) => void;
}

const ReasonComponent = ({ reason, onDelete }: ReasonComponentProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteReason = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reasons/${reason.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error((await response.json()).error);
      }

      onDelete(reason.id); // Appeler la fonction onDelete avec l'ID de la raison supprimée
      toast({
        title: "Motif supprimé",
        description: "Motif supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Echec",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-row justify-between items-center">
      <div className="text-xl font-semibold">{reason.name}</div>
      <div className="flex flex-row gap-2 items-center">
        <div className="text-sm text-white/50">{new Date(reason.createdAt).toLocaleDateString()}</div>
        <Button size="sm" onClick={handleDeleteReason} disabled={isLoading}>
          {isLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default ReasonComponent;