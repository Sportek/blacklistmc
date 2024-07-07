import BlacklistCard from "@/components/blacklist";
import { Blacklist, User } from "@prisma/client";

const RecentBlacklist = async () => {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blacklists?limit=4&order=desc`, {
    cache: "no-store",
  });

  if (!request.ok) return null;

  const blacklists = (await request.json()) as (Blacklist & {
    user: User;
  })[];

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      <div className="w-full flex flex-col gap-4 justify-between max-w-4xl p-4 z-10">
        <div className="font-bold text-xl">Blacklist récents</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {blacklists.map((blacklist) => {
            return <BlacklistCard key={blacklist.id} blacklist={blacklist} user={blacklist.user} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentBlacklist;
