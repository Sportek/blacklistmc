"use client";
import UserAvatar from "@/components/avatar";
import Card from "@/components/landing/card";
import RoleBadge from "@/components/user/role-badge";
import { Account, AccountRole, User } from "@prisma/client";

interface UserCardProps {
  user: User;
  account?: Account;
}
const UserCard = ({ user, account }: UserCardProps) => {
  return (
    <Card className="w-full flex flex-row gap-2 hover:bg-opacity-10 duration-75 transition-all ease-in-out items-center">
      <UserAvatar username={user.username} imageUrl={user.imageUrl} className="w-12 h-12" />
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-semibold">{user.displayName}</div>
        <RoleBadge role={account?.role ?? AccountRole.UNKNOWN} />
      </div>
    </Card>
  );
};

export default UserCard;
