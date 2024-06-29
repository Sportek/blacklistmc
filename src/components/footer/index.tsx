import Logo from "@/public/blacklistmc/logo.svg";
import Image from "next/image";
import Link from "next/link";
import BaseSpacing from "../base";
const Footer = () => {
  return (
    <div className="bg-white bg-opacity-10 w-full">
      <BaseSpacing className="w-full backdrop-blur-md p-4">
        <Link className="flex items-center gap-2" href="/">
          <Image src={Logo} alt="logo" width={25} />
          <div className="text-white text-2xl font-bold">BlacklistMC</div>
        </Link>
      </BaseSpacing>
    </div>
  );
};

export default Footer;
