import { ArrowLongRightIcon, ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { Blacklist, Reason, User } from "@prisma/client";
import Link from "next/link";
import Badge from "../landing/badge";
import Card from "../landing/card";
import UserCard from "../landing/user";

export const generateGradient = (blacklistId: number) => {
  const colors = [
    "linear-gradient(to top left, #ff7e5f, #feb47b)", // Orange to light orange
    "linear-gradient(to top left, #6a11cb, #2575fc)", // Purple to blue
    "linear-gradient(to top left, #fc6767, #ec008c)", // Pink to magenta
    "linear-gradient(to top left, #00c6ff, #0072ff)", // Light blue to dark blue
    "linear-gradient(to top left, #ff6b6b, #556270)", // Light red to dark grey
    "linear-gradient(to top left, #36d1dc, #5b86e5)", // Light teal to blue
    "linear-gradient(to top left, #ff0084, #33001b)", // Magenta to dark purple
    "linear-gradient(to top left, #ff9966, #ff5e62)", // Light orange to red
    "linear-gradient(to top left, #00c9ff, #92fe9d)", // Cyan to light green
    "linear-gradient(to top left, #fc00ff, #00dbde)", // Magenta to teal
    "linear-gradient(to top left, #f12711, #f5af19)", // Red to orange
    "linear-gradient(to top left, #43cea2, #185a9d)", // Light green to blue
    "linear-gradient(to top left, #9d50bb, #6e48aa)", // Purple to dark purple
    "linear-gradient(to top left, #ff4b1f, #1fddff)", // Orange to blue
    "linear-gradient(to top left, #ee9ca7, #ffdde1)", // Light pink to peach
    "linear-gradient(to top left, #42275a, #734b6d)", // Dark purple to light purple
    "linear-gradient(to top left, #eg0cc, #9aeb7e)", // Light orange to mint green
    "linear-gradient(to top left, #e0eafc, #cfdef3)", // Light blue to very light grey
    "linear-gradient(to top left, #00f260, #0575e6)", // Light green to blue
    "linear-gradient(to top left, #ffafbd, #ffc3a0)", // Light pink to peach
  ];
  return colors[blacklistId % colors.length];
};

export const isBlacklistExpired = (blacklist: Blacklist) => {
  return blacklist.expireAt && new Date(blacklist.expireAt) < new Date();
};

interface BlacklistProps {
  blacklist: Blacklist & { reason: Reason };
  user: User;
}
const BlacklistCard = ({ blacklist, user }: BlacklistProps) => {
  return (
    <Link key={blacklist.id} href={`/users/${blacklist.userId}`}>
      <Card className="p-4 hover:bg-opacity-30 transition-all duration-75 ease-in-out overflow-clip">
        <div className="flex flex-col items-center justify-center gap-4">
          <UserCard user={user} />
          <div className="flex flex-row gap-4 w-full h-full">
            <div
              className="border w-32 h-32 min-w-32 min-h-32 flex border-white border-opacity-20 rounded-md items-center justify-center text-center text-2xl font-semibold"
              style={{ background: generateGradient(blacklist.id) }}
            >
              {`#${blacklist.id.toString().padStart(4, "0")}`}
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xl font-extrabold">{blacklist.title || blacklist.reason?.name || "Sans motif"}</div>
              <div className="text-sm font-normal flex flex-row gap-2 items-center">
                <div className="whitespace-break-spaces flex-grow">
                  {new Date(blacklist.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <ArrowLongRightIcon className="w-4 h-4" />
                {blacklist.expireAt ? (
                  <div className="whitespace-break-spaces flex-grow">
                    {new Date(blacklist.expireAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                ) : (
                  <div className="whitespace-break-spaces flex-grow">Définitivement</div>
                )}
              </div>
              {isBlacklistExpired(blacklist) ? (
                <Badge icon={<ShieldCheckIcon className="w-4 h-4" />} label="RÉSOLU" className="bg-green-500" />
              ) : (
                <Badge icon={<ShieldExclamationIcon className="w-4 h-4" />} label="ACTIF" className="bg-red-500" />
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlacklistCard;
