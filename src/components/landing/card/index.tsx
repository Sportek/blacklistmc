import { cn } from "@/lib/utils";

interface CardProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white bg-opacity-20 rounded-lg p-2 border border-white border-opacity-20 backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
