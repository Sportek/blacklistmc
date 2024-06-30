import { ArrowLongRightIcon, ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { Blacklist, User } from "@prisma/client";
import Link from "next/link";
import Badge from "../landing/badge";
import Card from "../landing/card";
import UserCard from "../landing/user";

export const generateGradient = (blacklistId: number) => {
  const colors = [
    "linear-gradient(to top left, #f97316, #991b1b)", // Orange to Red
    "linear-gradient(to top left, #eab308, #854d0e)", // Yellow to Brown
    "linear-gradient(to top left, #22c55e, #166534)", // Green to Dark Green
    "linear-gradient(to top left, #3b82f6, #1e3a8a)", // Blue to Dark Blue
    "linear-gradient(to top left, #6366f1, #312e81)", // Indigo to Dark Indigo
    "linear-gradient(to top left, #8b5cf6, #5b21b6)", // Violet to Dark Violet
    "linear-gradient(to top left, #ff7f50, #ff4500)", // Coral to OrangeRed
    "linear-gradient(to top left, #ff6347, #ff0000)", // Tomato to Red
    "linear-gradient(to top left, #ffd700, #ffa500)", // Gold to Orange
    "linear-gradient(to top left, #adff2f, #7fff00)", // GreenYellow to Chartreuse
    "linear-gradient(to top left, #00ced1, #20b2aa)", // DarkTurquoise to LightSeaGreen
    "linear-gradient(to top left, #1e90ff, #0000ff)", // DodgerBlue to Blue
  ];
  return colors[blacklistId % colors.length];
};

export const isBlacklistExpired = (blacklist: Blacklist) => {
  return blacklist.expireAt && new Date(blacklist.expireAt) < new Date();
};

interface BlacklistProps {
  blacklist: Blacklist;
  user: User;
}
const BlacklistCard = ({ blacklist, user }: BlacklistProps) => {
  return (
    <Link key={blacklist.id} href={`/users/${blacklist.userId}`}>
      <Card className="p-4 hover:bg-opacity-30 transition-all duration-75 ease-in-out">
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
              <div className="text-xl font-extrabold">{blacklist.title}</div>
              <div className="text-sm font-normal flex flex-row gap-2 items-center">
                <div>
                  {new Date(blacklist.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <ArrowLongRightIcon className="w-4 h-4" />
                {blacklist.expireAt ? (
                  <div>
                    {new Date(blacklist.expireAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                ) : (
                  <div>Définitivement</div>
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
