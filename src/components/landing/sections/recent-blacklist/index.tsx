import { Blacklist, Proof, User } from "@prisma/client";
import { ArrowRightIcon } from "lucide-react";
import Card from "../../card";
import UserCard from "../../user";

const RecentBlacklist = async () => {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklists?limit=4&order=desc`, {
    cache: "no-cache",
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
        <div className="grid grid-cols-2 gap-2">
          {blacklists.map((blacklist) => {
            return (
              <Card key={blacklist.id} className="p-4">
                <div className="flex flex-col items-center justify-center gap-4">
                  <UserCard user={blacklist.user} />
                  <div className="flex flex-row gap-4 w-full h-full">
                    <div className="w-32 h-32 bg-gradient-to-tl from-orange-500 to bg-red-800 border border-white border-opacity-20 rounded-md"></div>
                    <div>
                      <div className="text-xl font-extrabold">{blacklist.title}</div>
                      <div className="text-sm font-normal flex flex-row gap-2 items-center">
                        <div>{new Date(blacklist.createdAt).toLocaleDateString()}</div>
                        <ArrowRightIcon className="w-4 h-4" />
                        {blacklist.blacklistUntil ? (
                          <div>{new Date(blacklist.blacklistUntil).toLocaleDateString()}</div>
                        ) : (
                          <div>Définitivement</div>
                        )}
                      </div>
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
