"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Blacklist, BlacklistStatus } from "@prisma/client";
import { blacklistStatusBadge } from "..";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const ChangeBlacklistStatus = ({ status, blacklist }: { status: BlacklistStatus, blacklist: Blacklist }) => {
  const router = useRouter();

  const handleStatusChange = async (status: BlacklistStatus) => {
    const response = await fetch(`/api/blacklists/${blacklist.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if(!response.ok) {
      toast({
        title: "Impossible de changer le statut du blacklist",
        description: (await response.json()).error,
        variant: "destructive",
      });

      return;
    }

    toast({
      title: "Statut du blacklist changé",
      description: "Le statut du blacklist a été changé avec succès",
      variant: "default",
    });

    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{blacklistStatusBadge(status)}</DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.values(BlacklistStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            className="text-white hover:text-white hover:cursor-pointer"
            onClick={() => handleStatusChange(status)}
          >
            {blacklistStatusBadge(status)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChangeBlacklistStatus;