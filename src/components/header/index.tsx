import logo from "@/public/blacklistmc/logo.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full flex justify-between max-w-6xl p-4 z-10">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="logo" width={25} />
        <div className="text-white text-2xl font-bold">BlacklistMC</div>
      </div>
      <div className="flex items-center gap-4">
        <Link className="text-white text-lg font-medium" href="">
          Report
        </Link>
        <Link className="text-white text-lg font-medium" href="https://discord.gg/blacklistmc">
          Discord
        </Link>
      </div>
    </div>
  );
};

export default Header;
