"use client";
import UserAvatar from "@/components/avatar";
import RoleBadge from "@/components/user/role-badge";
import { useAuth } from "@/contexts/useAuth";
import { cn } from "@/lib/utils";

interface UserSidebarProps {
  className?: string;
}
const UserSidebar = ({ className }: UserSidebarProps) => {
  const { account } = useAuth();
  if (!account) return null;

  return (
    <div className={cn("flex flex-row gap-2 p-4", className)}>
      <UserAvatar imageUrl={account.user.imageUrl} username={account.user.username} className="w-12 h-12" />
      <div className="flex flex-col">
        <RoleBadge role={account.role} />
        <div className="text-xl font-medium">{account.user.displayName}</div>
      </div>
    </div>
  );
};

export default UserSidebar;
