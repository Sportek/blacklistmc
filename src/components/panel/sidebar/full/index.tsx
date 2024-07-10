import Logo from "@/public/blacklistmc/logo.svg";
import { KeyIcon, TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import SidebarComponent from "../component";
import UserSidebar from "../user";

const FullSidebar = () => {
  return (
    <div className="w-full sm:max-w-64 bg-slate-950 sm:h-screen flex flex-col">
      <Link href="/">
        <div className="flex gap-4 items-center p-4">
          <Image src={Logo} alt="Logo" width={32} height={32} />
          <div className="flex flex-col items-center">
            <h1 className="text-white text-2xl font-bold">BlacklistMC</h1>
          </div>
        </div>
      </Link>
      <hr className="w-full h-[1px] bg-slate-800 sm:block hidden" />
      <UserSidebar className="bg-slate-900 sm:flex hidden" />
      <hr className="w-full h-[1px] bg-slate-800 sm:block hidden" />
      <div className="flex sm:flex-col gap-2 sm:gap-0 sm:bg-transparent bg-slate-900">
        <SidebarComponent title="Users" icon={<UserIcon className="w-6 h-6" />} href="/dashboard/users" />
        <SidebarComponent title="Blacklists" icon={<TrashIcon className="w-6 h-6" />} href="/dashboard/blacklists" />
        <SidebarComponent title="Tokens" icon={<KeyIcon className="w-6 h-6" />} href="/dashboard/tokens" />
      </div>
    </div>
  );
};

export default FullSidebar;
