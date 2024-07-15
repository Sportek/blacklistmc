import { cn } from "@/lib/utils";
import "./loader.css";

const Loader = ({ className }: { className: string }) => {
  const delays = [0, 100, 200, 100, 200, 300, 200, 300, 400, 0, 100, 200, 100, 200, 300, 200, 300, 400];

  return (
    <div className={cn("grid grid-cols-6 gap-2", className)}>
      {delays.map((delay, index) => (
        <div
          key={index}
          className={cn(
            "w-8 h-10 rounded-md bg-current border border-white border-opacity-10 animate-pulse",
            delay && `delay-${delay}`
          )}
        ></div>
      ))}
    </div>
  );
};

export default Loader;
