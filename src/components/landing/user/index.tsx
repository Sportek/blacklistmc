import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { User, UserStatus } from "@prisma/client";
import { AlertCircle, Check } from "lucide-react";
import Badge from "../badge";

interface UserProps {
  user: User & { _count: { votes: number } };
}

export const getStatusBadge = (status: UserStatus) => {
  if (status === UserStatus.BLACKLISTED) {
    return <Badge icon={<ShieldExclamationIcon className="w-4 h-4" />} label="BLACKLIST" className="bg-red-500" />;
  } else if (status === UserStatus.TRUSTED) {
    return <Badge icon={<Check size={16} />} label="TRUSTED" className="bg-green-500" />;
  } else {
    return <Badge icon={<AlertCircle size={16} />} label="Unknown" className="bg-gray-500" />;
  }
};

const UserCard = ({ user }: UserProps) => {
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
