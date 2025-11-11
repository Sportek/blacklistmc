import BlacklistCard from "@/components/blacklist";
import prisma from "@/lib/prisma";

const RecentBlacklist = async () => {
  const blacklists = await prisma.blacklist.findMany({
    where: {
      status: "APPROVED",
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      reason: true,
      votes: true,
      _count: {
        select: {
          votes: true,
        },
      },
      proofs: true,
    },
  });

  if (blacklists.length === 0) return null;

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
