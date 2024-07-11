import BlacklistCard from "@/components/panel/blacklists";
import DashboardPagination from "@/components/panel/users/paginate";
import prisma from "@/lib/prisma";
import { Blacklist, User } from "@prisma/client";

interface DashboardBlacklistProps {
  searchParams: {
    search?: string;
    page?: string;
    nElement?: string;
  };
}
const DashboardBlacklist = async ({ searchParams }: DashboardBlacklistProps) => {
  const search = searchParams.search ?? "";
  const page = searchParams.page ?? "1";
  const nElement = searchParams.nElement ?? "7";
  const blacklistAmount = await prisma.blacklist.count();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/blacklists?page=${page}&search=${search}&limit=${nElement}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const blacklists: (Blacklist & { user: User })[] = await response.json();
  const maxPage = Math.ceil(blacklistAmount / parseInt(nElement));

  return (
    <div className="w-full flex flex-col gap-2 items-center overflow-y-auto h-screen pt-8 px-2">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <div className="text-2xl font-semibold w-full">Blacklists</div>
        <DashboardPagination maxPage={maxPage} basePath="/dashboard/blacklists" />
        <div className="flex flex-col gap-2">
          {blacklists.map((blacklist) => (
            <BlacklistCard key={blacklist.id} blacklist={blacklist} user={blacklist.user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardBlacklist;
