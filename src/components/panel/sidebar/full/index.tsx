import Logo from "@/public/blacklistmc/logo.svg";
import Image from "next/image";
import UserSidebar from "../user";

const FullSidebar = () => {
  return (
    <div className="w-full max-w-64 bg-slate-950 h-screen flex flex-col">
      <div className="flex gap-4 items-center p-4">
        <Image src={Logo} alt="Logo" width={32} height={32} />
        <div className="flex flex-col items-center">
          <h1 className="text-white text-2xl font-bold">BlacklistMC</h1>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-slate-800" />
      <UserSidebar />
    </div>
  );
};

export default FullSidebar;
