"use client"; // Assurez-vous que cette ligne est présente

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface OrbitProps {
  radius: number;
  items: React.ReactNode[];
  speed: number;
  children?: React.ReactNode;
}

const Orbit = ({ radius, items, speed, children }: OrbitProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: 360,
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, [controls, speed]);

  const angleStep = 360 / items.length;

  return (
    <motion.div
      className="inset-0 flex justify-center items-center border-2 border-dashed border-white border-opacity-20 rounded-full z-0"
      style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
      animate={controls}
    >
      <div className="relative" style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}>
        {items.map((item, index) => {
          const angle = index * angleStep;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={index}
              className="absolute rounded-full"
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {item}
            </div>
          );
        })}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="flex justify-center items-center w-full h-full">{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Orbit;
