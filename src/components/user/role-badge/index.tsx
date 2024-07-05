"use client";
import Badge from "@/components/landing/badge";
import { ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { AccountRole } from "@prisma/client";

const roleBadgeMap = {
  [AccountRole.ADMIN]: {
    icon: <ShieldExclamationIcon className="w-4 h-4" />,
    label: "ADMIN",
    className: "bg-red-500 px-1",
  },
  [AccountRole.SUPERVISOR]: {
    icon: <ShieldExclamationIcon className="w-4 h-4" />,
    label: "SUPERVISOR",
    className: "bg-orange-500 px-1",
  },
  [AccountRole.USER]: {
    icon: <ShieldCheckIcon className="w-4 h-4" />,
    label: "USER",
    className: "bg-green-500 px-1",
  },
  [AccountRole.SUPPORT]: {
    icon: <ShieldExclamationIcon className="w-4 h-4" />,
    label: "SUPPORT",
    className: "bg-orange-500 px-1",
  },
  [AccountRole.UNKNOWN]: {
    icon: <ShieldExclamationIcon className="w-4 h-4" />,
    label: "UNKNOWN",
    className: "bg-gray-500 px-1",
  },
};

const getRoleBadge = (role: AccountRole | undefined) => {
  const { icon, label, className } = roleBadgeMap[role || AccountRole.UNKNOWN] || roleBadgeMap[AccountRole.UNKNOWN];
  return <Badge icon={icon} label={label} className={className} />;
};

interface StatusBadgeProps {
  role: AccountRole | undefined;
}

const RoleBadge = ({ role }: StatusBadgeProps) => {
  if (!role) return null;

  return getRoleBadge(role);
};

export default RoleBadge;
