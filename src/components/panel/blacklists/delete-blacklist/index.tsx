"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Blacklist } from "@prisma/client";
import { useRouter } from "next/navigation";

const DeleteBlacklist = ({ blacklist }: { blacklist: Blacklist }) => {
  const router = useRouter();
  const handleDelete = async () => {
    const response = await fetch(`/api/blacklists/${blacklist.id}`, {
      method: "DELETE",
    });

    if(!response.ok) {
      toast({
        title: "Impossible de supprimer le blacklist",
        description: (await response.json()).error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Blacklist supprimé",
      description: "Le blacklist a été supprimé avec succès",
      variant: "default",
    });

    router.push("/dashboard/blacklists");
    router.refresh();
  };
  return <Button onClick={handleDelete}>Supprimer le blacklist</Button>;
};

export default DeleteBlacklist;