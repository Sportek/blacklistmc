import DashboardPagination from "@/components/panel/users/paginate";
import UserCard from "@/components/panel/users/user-card";
import prisma from "@/lib/prisma";
import { User } from "@/prisma/generated/prisma/client";

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

  const url = `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&search=${search}&limit=${nElement}`;
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const users: User[] = await response.json();

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
