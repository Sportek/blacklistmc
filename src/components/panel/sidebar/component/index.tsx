"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarComponentProps {
  title: string;
  icon: React.ReactNode;
  href?: string;
}
const SidebarComponent = ({ title, icon, href }: SidebarComponentProps) => {
  const selectedPath = href ?? "";
  const path = usePathname();
  const isActive = path.includes(selectedPath);

  return (
    <Link href={selectedPath}>
      <div
        className={cn(
          "flex flex-row gap-2 p-2 items-center hover:bg-white hover:bg-opacity-10",
          isActive ? "bg-white bg-opacity-20" : ""
        )}
      >
        {icon}
        <div className="text-white text-xl font-semibold">{title}</div>
      </div>
    </Link>
  );
};

export default SidebarComponent;
