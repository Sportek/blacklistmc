import { SignIn } from "@/components/auth/sign-in";
import Shield from "@/components/icons/shield";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { UserStatus } from "@/types/types";
import { AlertCircle, Check, Search } from "lucide-react";

export default function Home() {
  const temporaryFakes = [
    {
      name: "John Doe",
      username: "john.doe",
      status: UserStatus.BLACKLISTED,
      imageUrl: "https://picsum.photos/200/200",
    },
    {
      name: "Jonathan Doe",
      username: "jonathan.doe",
      status: UserStatus.TRUSTED,
      imageUrl: "https://picsum.photos/200/200",
    },
    {
      name: "Jordan",
      username: "jordan",
      status: UserStatus.UNKNOWN,
      imageUrl: "https://picsum.photos/200/200",
    },
  ];

  function getStatusBadge(status: UserStatus) {
    if (status === UserStatus.BLACKLISTED) {
      return (
        <div className="bg-red-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit">
          <Shield />
          Blacklist
        </div>
      );
    } else if (status === UserStatus.TRUSTED) {
      return (
        <div className="bg-green-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit">
          <Check size={16} />
          Trusted
        </div>
      );
    } else {
      return (
        <div className="bg-gray-500 rounded-md gap-2 flex flex-row items-center px-2 w-fit h-fit">
          <AlertCircle size={16} />
          Unknown
        </div>
      );
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <SignIn />
      <div className="flex flex-col gap-4 w-full max-w-3xl justify-center items-center p-4">
        <div className="text-2xl font-semibold w-full text-center">Rechercher une personne</div>

        <div className="flex items-center gap-4 px-4 py-3 bg-white bg-opacity-20 rounded-lg border border-white border-opacity-20 w-full">
          <Search size={24} />
          <Input
            placeholder="Identifiant, pseudonyme, displayname, ..."
            className="h-full placeholder:text-white/70 bg-transparent border-none text-white w-full"
          ></Input>
        </div>

        <div className="bg-white bg-opacity-20 p-4 rounded-lg border border-white border-opacity-20 gap-4 w-full">
          <div className="text-lg font-semibold">Résultats</div>
          <div className="flex flex-col gap-4">
            {temporaryFakes.map((fake, index) => (
              <div className="bg-white bg-opacity-20 rounded-lg p-2" key={fake.username}>
                <div className="flex items-center gap-2">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={fake.imageUrl} alt={fake.username} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-lg font-semibold">{fake.name}</div>
                      <div className="text-md text-white/70">@{fake.username}</div>
                    </div>
                    {getStatusBadge(fake.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
