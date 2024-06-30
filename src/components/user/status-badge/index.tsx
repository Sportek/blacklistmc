"use client";
import Badge from "@/components/landing/badge";
import fetcher from "@/lib/fetcher";
import { UserStatus } from "@/types/types";
import { ArrowPathIcon, ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { User } from "@prisma/client";
import useSWR from "swr";

const getStatusBadge = (status: UserStatus) => {
  if (status === UserStatus.BLACKLISTED) {
    return <Badge icon={<ShieldExclamationIcon className="w-4 h-4" />} label="BLACKLIST" className="bg-red-500" />;
  } else if (status === UserStatus.OLD_BLACKLISTED) {
    return (
      <Badge icon={<ShieldExclamationIcon className="w-4 h-4" />} label="ANCIEN BLACKLIST" className="bg-orange-500" />
    );
  } else {
    return <Badge icon={<ShieldCheckIcon className="w-4 h-4" />} label="NON BLACKLIST" className="bg-green-500" />;
  }
};

interface StatusBadgeProps {
  user: User;
}

const StatusBadge = ({ user }: StatusBadgeProps) => {
  const { data, isLoading } = useSWR(`/api/users/${user.id}/status`, fetcher);

  if (isLoading)
    return <Badge icon={<ArrowPathIcon className="w-4 h-4 animate-spin" />} label="LOADING" className="bg-gray-500" />;
  if (data) return getStatusBadge(data.status);

  return null;
};

export default StatusBadge;
