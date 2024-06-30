import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BaseSpacingProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const BaseSpacing = ({ children, className, ...props }: BaseSpacingProps) => {
  return (
    <div className="w-full flex flex-col items-center h-full flex-grow">
      <div className={cn("max-w-6xl p-4 w-full", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

export default BaseSpacing;
