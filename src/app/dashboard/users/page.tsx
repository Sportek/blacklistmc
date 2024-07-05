import UserCard from "@/components/panel/users/user-card";
import prisma from "@/lib/prisma";

const Users = async () => {
  const users = await prisma.user.findMany();
  const accounts = await prisma.account.findMany();

  const accountUserMap = users.map((user) => ({
    user,
    account: accounts.find((account) => account.userId === user.id),
  }));

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <div className="text-2xl font-semibold w-full">Users</div>
        <div className="flex flex-col gap-2">
          {accountUserMap.map((user) => (
            <UserCard key={user.user.id} user={user.user} account={user.account} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
