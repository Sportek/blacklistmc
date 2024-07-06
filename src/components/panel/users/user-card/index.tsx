"use client";
import UserAvatar from "@/components/avatar";
import Card from "@/components/landing/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RoleBadge from "@/components/user/role-badge";
import { useAuth } from "@/contexts/useAuth";
import { Account, AccountRole, User } from "@prisma/client";

interface UserCardProps {
  user: User;
  userAccount?: Account;
}
const UserCard = ({ user, userAccount }: UserCardProps) => {
  const { account } = useAuth();

  return (
    <Card className="w-full flex flex-row gap-2 hover:bg-opacity-10 duration-75 transition-all ease-in-out items-center">
      <UserAvatar username={user.username} imageUrl={user.imageUrl} className="w-12 h-12" />
      <div className="flex flex-row gap-2 p-2 w-full justify-between">
        <div className="flex flex-row gap-2 items-center">
          <RoleBadge role={userAccount?.role} />
          <div className="text-xl font-semibold">{user.displayName}</div>
        </div>
        {account?.role === AccountRole.ADMIN && userAccount && userAccount.id !== account.id && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button>Change role</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.values(AccountRole).map((role) => (
                <DropdownMenuItem key={role} className="text-white hover:text-white hover:cursor-pointer">
                  <RoleBadge role={role} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
};

export default UserCard;
