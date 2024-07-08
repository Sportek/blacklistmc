import BaseSpacing from "@/components/base";
import Gradient from "@/components/landing/gradient";

interface BlacklistsParams {
  params: {
    id: string;
  };
}
const Blacklist = ({ params }: BlacklistsParams) => {
  return (
    <div>
      <div className="absolute inset-0 z-0 max-h-[100vh] top-[-200px]">
        <Gradient />
      </div>
      <BaseSpacing className="z-10 flex flex-col items-center gap-10 max-w-4xl flex-grow">
        <div>s</div>
      </BaseSpacing>
    </div>
  );
};

export default Blacklist;
