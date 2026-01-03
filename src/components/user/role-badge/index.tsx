"use client";
import Badge from "@/components/landing/badge";
import {
  PencilIcon,
  ShieldExclamationIcon,
  UserIcon,
  WrenchIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";
import { AccountRole } from "@/prisma/generated/prisma/browser";

const roleBadgeMap = {
  [AccountRole.ADMIN]: {
    icon: <WrenchScrewdriverIcon className="w-4 h-4" />,
    label: "GÉRANT",
    className: "bg-red-600 px-1",
  },
  [AccountRole.SUPERVISOR]: {
    icon: <WrenchIcon className="w-4 h-4" />,
    label: "SUPERVISEUR",
    className: "bg-red-500 px-1",
  },
  [AccountRole.USER]: {
    icon: <UserIcon className="w-4 h-4" />,
    label: "UTILISATEUR",
    className: "bg-green-500 px-1",
  },
  [AccountRole.SUPPORT]: {
    icon: <PencilIcon className="w-4 h-4" />,
    label: "SUPPORT",
    className: "bg-red-400 px-1",
  },
  [AccountRole.UNKNOWN]: {
    icon: <ShieldExclamationIcon className="w-4 h-4" />,
    label: "INCONNU",
    className: "bg-gray-500 px-1",
  },
};

const getRoleBadge = (role: AccountRole | undefined) => {
  const { icon, label, className } = roleBadgeMap[role ?? AccountRole.UNKNOWN] || roleBadgeMap[AccountRole.UNKNOWN];
  return <Badge icon={icon} label={label} className={className} />;
};

interface StatusBadgeProps {
  role: AccountRole | undefined;
}

const RoleBadge = ({ role }: StatusBadgeProps) => {
  return getRoleBadge(role);
};

export default RoleBadge;
