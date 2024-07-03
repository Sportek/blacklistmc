import logo from "@/public/blacklistmc/logo.svg";
import Image from "next/image";
import Link from "next/link";
import DiscordLogin from "../auth/discord-login";

const Header = () => {
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
        <DiscordLogin className="text-white text-lg font-medium">Login</DiscordLogin>
      </div>
    </div>
  );
};

export default Header;
