"use client";
import { useAuth } from "@/contexts/useAuth";
import logo from "@/public/blacklistmc/logo.svg";
import { ArrowLeftEndOnRectangleIcon, BeakerIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DiscordLogin from "../auth/discord-login";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = () => {
  const { isAuthenticated, account, logout } = useAuth();
  const router = useRouter();

  const displayUserSection = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={account?.user?.imageUrl} />
            <AvatarFallback className="text-white text-lg font-medium bg-slate-900">{account?.email}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          {account?.role === "ADMIN" || account?.role === "SUPPORT" || account?.role === "SUPERVISOR" ? (
            <>
              <DropdownMenuItem
                className="hover:cursor-pointer text-sm font-semibold"
                onClick={() => router.push("/dashboard")}
              >
                <BeakerIcon className="w-6 h-6 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : null}
          <DropdownMenuItem
            className="hover:cursor-pointer text-sm font-semibold text-red-800"
            onClick={() => logout()}
          >
            <ArrowLeftEndOnRectangleIcon className="w-6 h-6 mr-2" />
            LOGOUT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-full flex justify-between max-w-6xl p-4 z-10">
      <Link className="flex items-center gap-2" href="/">
        <Image src={logo} alt="logo" width={25} />
        <div className="text-white text-2xl font-bold">BlacklistMC</div>
      </Link>
      <div className="flex items-center gap-8">
        <Link className="text-white text-lg font-medium" href="">
          Report
        </Link>
        <Link className="text-white text-lg font-medium" href="https://discord.gg/blacklistmc">
          Discord
        </Link>

        {isAuthenticated ? (
          displayUserSection()
        ) : (
          <DiscordLogin className="text-white text-lg font-medium">Login</DiscordLogin>
        )}
      </div>
    </div>
  );
};

export default Header;
