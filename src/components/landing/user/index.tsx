import Shield from "@/components/icons/shield";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserStatus } from "@prisma/client";
import { AlertCircle, Check } from "lucide-react";
import { useCallback } from "react";

interface UserProps {
  user: User & { _count: { votes: number } };
}

const UserCard = ({ user }: UserProps) => {
  const getStatusBadge = useCallback((status: UserStatus) => {
    if (status === UserStatus.BLACKLISTED) {
      return (
        <div className="bg-red-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit border border-white border-opacity-20">
          <Shield />
          Blacklist
        </div>
      );
    } else if (status === UserStatus.TRUSTED) {
      return (
        <div className="bg-green-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit border border-white border-opacity-20">
          <Check size={16} />
          Trusted
        </div>
      );
    } else {
      return (
        <div className="bg-gray-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit border border-white border-opacity-20">
          <AlertCircle size={16} />
          Unknown
        </div>
      );
    }
  }, []);

  return (
    <div className="flex items-center gap-2 w-full">
      <Avatar className="w-12 h-12">
        <AvatarImage src={user.imageUrl} alt={user.id} />
        <AvatarFallback className="bg-slate-900 text-white font-semibold">{user.displayName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <div className="text-lg font-bold">{user.displayName}</div>
          <div className="text-sm font-normal text-white/70">@{user.username}</div>
        </div>
        {getStatusBadge(user.status)}
      </div>
    </div>
  );
};

export default UserCard;
