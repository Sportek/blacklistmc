import Gradient from "@/components/landing/gradient";
import Loader from "@/components/landing/loader";
import Logo from "@/public/blacklistmc/logo.svg";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center">
      <div className="absolute inset-0 max-h-[100vh] overflow-x-clip">
        <Gradient className="-z-50" />
      </div>

      <div className="flex flex-col items-center justify-center z-50">
        <div className="flex flex-row gap-4 items-center">
          <Image src={Logo} width={75} height={75} alt="Logo" />
          <div className="text-white text-7xl font-bold">BlacklistMC</div>
        </div>
        <Loader className="text-indigo-900" />
      </div>
    </div>
  );
};

export default Loading;
