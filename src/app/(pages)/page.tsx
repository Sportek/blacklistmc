import BaseSpacing from "@/components/base";
import Gradient from "@/components/landing/gradient";
import MultipleOrbit from "@/components/landing/multiple-orbit";
import RecentBlacklist from "@/components/landing/sections/recent-blacklist";
import SearchBlacklist from "@/components/landing/sections/search-blacklist";
import Victim from "@/components/landing/sections/victim";

export default async function Home() {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 max-h-[100vh] overflow-x-clip">
        <MultipleOrbit className="-z-30" />
        <Gradient className="-z-50" />
      </div>
      <BaseSpacing>
        <div className="flex flex-col gap-20">
          <SearchBlacklist />
          <RecentBlacklist />
          <Victim />
        </div>
      </BaseSpacing>
    </>
  );
}
