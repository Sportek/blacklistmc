import { Blacklist, Proof, User } from "@prisma/client";
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
              <Card key={blacklist.id}>
                <div className="flex flex-col items-center justify-center">
                  <UserCard user={blacklist.user} />
                  <div className="flex flex-row gap-4">
                    <div>Image</div>
                    <div>
                      <div>{blacklist.reason}</div>
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
