"use client"; // Assurez-vous que cette ligne est présente

import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface OrbitProps {
  radius: number;
  items: React.ReactNode[];
  speed: number;
  children?: React.ReactNode;
  className?: string;
}

const Orbit = ({ radius, items, speed, children, className }: OrbitProps) => {
  const controls = useAnimation();

  const inversedControls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      },
    });

    inversedControls.start({
      rotate: -360,
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, [controls, speed, inversedControls]);

  const angleStep = 360 / items.length;

  return (
    <div className="absolute w-full h-full flex justify-center items-center">
      <motion.div
        className={cn(
          "relative inset-0 flex justify-center items-center border-2 border-dashed border-white border-opacity-20 rounded-full w-full h-full",
          className
        )}
        style={{ width: `${radius * 2}px`, height: `${radius * 2}px`, transformOrigin: "center" }}
        animate={controls}
      >
        <div className="relative" style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}>
          {items.map((item, index) => {
            const angle = index * angleStep;
            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <motion.div
                key={index}
                className="absolute"
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: `translate(-50%, -50%)`,
                }}
              >
                <motion.div className="rounded-full" animate={inversedControls}>
                  {item}
                </motion.div>
              </motion.div>
            );
          })}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="flex justify-center items-center w-full h-full">{children}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Orbit;
