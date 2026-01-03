import DashboardPagination from "@/components/panel/users/paginate";
import UserCard from "@/components/panel/users/user-card";
import prisma from "@/lib/prisma";

interface UsersProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    nElement?: string;
  }>;
}
const Users = async (props: UsersProps) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search ?? "";
  const page = searchParams.page ?? "1";
  const nElement = searchParams.nElement ?? "7";

  const userAmount = await prisma.user.count();

  const users = await prisma.user.findMany({
    where: search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { displayName: { contains: search, mode: "insensitive" } },
            { id: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    skip: (parseInt(page) - 1) * parseInt(nElement),
    take: parseInt(nElement),
    orderBy: { createdAt: "desc" },
  });

  const accounts = await prisma.account.findMany();

  const accountUserMap = users.map((user) => ({
    user,
    account: accounts.find((account) => account.userId === user.id),
  }));

  const maxPage = Math.ceil(userAmount / parseInt(nElement));

  return (
    <div className="w-full flex flex-col gap-2 items-center overflow-y-auto h-screen pt-8 px-2">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <div className="text-2xl font-semibold w-full">Utilisateurs</div>
        <DashboardPagination maxPage={maxPage} basePath="/dashboard/users" />
        <div className="flex flex-col gap-2">
          {accountUserMap.map((user) => (
            <UserCard key={user.user.id} user={user.user} userAccount={user.account} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
