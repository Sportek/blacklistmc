import { cn } from "@/lib/utils";

interface BadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}
const Badge = ({ icon, label, className }: BadgeProps) => {
  return (
    <div
      className={cn(
        "rounded-md text-sm font-semibold gap-1 flex flex-row items-center px-2 w-fit h-fit border border-white border-opacity-40",
        className
      )}
    >
      {icon}
      {label}
    </div>
  );
};

export default Badge;
