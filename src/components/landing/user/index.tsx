import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from "@/components/user/status-badge";
import { User } from "@prisma/client";

interface UserProps {
  user: User;
}

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
        <StatusBadge user={user} />
      </div>
    </div>
  );
};

export default UserCard;
