import logo from "@/public/blacklistmc/logo.svg";
import Image from "next/image";

const Header = () => {
  return (
    <div className="w-full flex justify-between max-w-6xl p-4">
      <div className="flex items-center gap-2">
        <Image src={logo} alt="logo" width={25} />
        <div className="text-white text-3xl font-bold">BlacklistMC</div>
      </div>
    </div>
  );
};

export default Header;
