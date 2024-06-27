import RecentBlacklist from "@/components/landing/sections/recent-blacklist";
import SearchBlacklist from "@/components/landing/sections/search-blacklist";
import Victim from "@/components/landing/sections/victim";

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <SearchBlacklist />
      <RecentBlacklist />
      <Victim />
    </div>
  );
}
