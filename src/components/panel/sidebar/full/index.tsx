import Logo from "@/public/blacklistmc/logo.svg";
import { KeyIcon, TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import SidebarComponent from "../component";
import UserSidebar from "../user";

const FullSidebar = () => {
  return (
    <div className="w-full max-w-64 bg-slate-950 h-screen flex flex-col">
      <Link href="/">
        <div className="flex gap-4 items-center p-4">
          <Image src={Logo} alt="Logo" width={32} height={32} />
          <div className="flex flex-col items-center">
            <h1 className="text-white text-2xl font-bold">BlacklistMC</h1>
          </div>
        </div>
      </Link>
      <hr className="w-full h-[1px] bg-slate-800" />
      <UserSidebar className="bg-slate-900" />
      <hr className="w-full h-[1px] bg-slate-800" />
      <div className="flex flex-col">
        <SidebarComponent title="Users" icon={<UserIcon className="w-4 h-4" />} href="/dashboard/users" />
        <SidebarComponent title="Blacklists" icon={<TrashIcon className="w-4 h-4" />} href="/dashboard/blacklists" />
        <SidebarComponent title="Tokens" icon={<KeyIcon className="w-4 h-4" />} href="/dashboard/tokens" />
      </div>
    </div>
  );
};

export default FullSidebar;
