import { User } from "@prisma/client";
import Image from "next/image";
import Orbit from "../orbit";

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const MultipleOrbit = async () => {
  const firstLine = generateRandomNumber(3, 6);
  const secondLine = generateRandomNumber(3, 6);
  const thirdLine = generateRandomNumber(3, 6);

  const types = [
    {
      type: "big",
      width: 50,
      height: 50,
    },
    {
      type: "medium",
      width: 30,
      height: 30,
    },
    {
      type: "small",
      width: 30,
      height: 30,
    },
  ];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?limit=${firstLine + secondLine + thirdLine}&random=true`
  );
  const users = (await response.json()) as User[];

  return (
    <div className="absolute inset-0 flex justify-center items-center -z-50">
      <Orbit
        speed={100}
        radius={400}
        items={users.slice(0, firstLine).map((user) => {
          const type = types[generateRandomNumber(0, 2)];
          return (
            <Image
              className="rounded-full"
              key={user.id}
              src={user.imageUrl}
              alt={user.displayName}
              width={type.width}
              height={type.height}
            />
          );
        })}
      >
        <Orbit
          speed={140}
          radius={350}
          items={users.slice(firstLine, firstLine + secondLine).map((user) => {
            const type = types[generateRandomNumber(0, 2)];
            return (
              <Image
                className="rounded-full"
                key={user.id}
                src={user.imageUrl}
                alt={user.displayName}
                width={type.width}
                height={type.height}
              />
            );
          })}
        >
          <Orbit
            speed={180}
            radius={300}
            items={users.slice(firstLine + secondLine, firstLine + secondLine + thirdLine).map((user) => {
              const type = types[generateRandomNumber(0, 2)];
              return (
                <Image
                  className="rounded-full"
                  key={user.id}
                  src={user.imageUrl}
                  alt={user.displayName}
                  width={type.width}
                  height={type.height}
                />
              );
            })}
          />
        </Orbit>
      </Orbit>
    </div>
  );
};

export default MultipleOrbit;
