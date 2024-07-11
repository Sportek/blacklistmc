import Badge from "@/components/landing/badge";
import Card from "@/components/landing/card";
import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Blacklist, BlacklistStatus, User } from "@prisma/client";
import Image from "next/image";

const BlacklistCard = ({ blacklist, user }: { blacklist: Blacklist, user: User }) => {

  const blacklistStatusBadge = (status: BlacklistStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge icon={<ClockIcon className="w-4 h-4" />} label="Pending" />
      case "APPROVED":
        return <Badge icon={<CheckIcon className="w-4 h-4" />} label="Approved" />
      case "REJECTED":
        return <Badge icon={<XMarkIcon className="w-4 h-4" />} label="Rejected" />
      default:
        return <Badge icon={<ClockIcon className="w-4 h-4" />} label="Pending" />
    }
  }



  return (
    <Card className="gap-1 flex flex-col">
      <div className="flex items-center gap-2">
        <Image src={user.imageUrl} alt="User" width={32} height={32} className="rounded-full" />
        <div className="text-xl font-semibold">{user.displayName}</div>
        <div className="text-sm">@{user.username}</div>
      </div>
      <div className="text-lg flex items-center gap-2">
        {blacklistStatusBadge(blacklist.status)}
        {blacklist.title}
      </div>
    </Card>
  );
};

export default BlacklistCard;