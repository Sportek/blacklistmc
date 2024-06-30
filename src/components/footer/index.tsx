import Logo from "@/public/blacklistmc/logo.svg";
import Image from "next/image";
import Link from "next/link";
import BaseSpacing from "../base";
const Footer = () => {
  return (
    <div className="bg-white bg-opacity-10 w-full">
      <BaseSpacing className="w-full backdrop-blur-md p-4 flex flex-row gap-2 items-center justify-between">
        <Link className="flex items-center gap-2" href="/">
          <Image src={Logo} alt="logo" width={25} />
          <div className="text-white text-2xl font-bold">BlacklistMC</div>
        </Link>
        <div>
          <div className="text-white text-sm flex flex-raw gap-2">
            <div className="flex flex-row gap-2">
              <div>Développé par</div>
              <Link className="text-blue-500" href="https://sportek.dev">
                Sportek,
              </Link>
            </div>
            <div className="flex flex-row gap-2">
              <div>design par</div>
              <Link className="text-blue-500" href="https://itsme.to">
                Théo
              </Link>
            </div>
          </div>
        </div>
      </BaseSpacing>
    </div>
  );
};

export default Footer;
