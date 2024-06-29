import { ArrowLongRightIcon, ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { Blacklist, Proof, User } from "@prisma/client";
import Badge from "../../badge";
import Card from "../../card";
import UserCard from "../../user";

const RecentBlacklist = async () => {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklists?limit=4&order=desc`, {
    next: { revalidate: 3600 },
  });
  const blacklists = (await request.json()) as (Blacklist & {
    user: User & { _count: { votes: number } };
    moderator: User;
    proofs: Proof[];
  })[];

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-4 justify-between max-w-6xl p-4 z-10">
        <div className="font-bold text-xl">Blacklist récents</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {blacklists.map((blacklist) => {
            return (
              <Card key={blacklist.id} className="p-4">
                <div className="flex flex-col items-center justify-center gap-4">
                  <UserCard user={blacklist.user} />
                  <div className="flex flex-row gap-4 w-full h-full">
                    <div className="w-32 h-32 bg-gradient-to-tl from-orange-500 to bg-red-800 border border-white border-opacity-20 rounded-md"></div>
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
                        {blacklist.blacklistUntil ? (
                          <div>
                            {new Date(blacklist.blacklistUntil).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        ) : (
                          <div>Définitivement</div>
                        )}
                      </div>
                      {!blacklist.blacklistUntil || blacklist.blacklistUntil < new Date() ? (
                        <Badge
                          icon={<ShieldExclamationIcon className="w-4 h-4" />}
                          label="ACTIF"
                          className="bg-red-500"
                        />
                      ) : (
                        <Badge icon={<ShieldCheckIcon className="w-4 h-4" />} label="RÉSOLU" className="bg-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentBlacklist;
