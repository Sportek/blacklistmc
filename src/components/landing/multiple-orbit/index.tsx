import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Orbit from "../orbit";

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface MultipleOrbitProps {
  className?: string;
}

const MultipleOrbit = async ({ className }: MultipleOrbitProps) => {
  const firstLine = generateRandomNumber(4, 7);
  const secondLine = generateRandomNumber(2, 8);
  const thirdLine = generateRandomNumber(3, 6);

  // Fetch random users directly from Prisma
  const totalUsers = await prisma.user.count();
  const randomSkip = Math.max(0, Math.floor(Math.random() * (totalUsers - (firstLine + secondLine + thirdLine))));
  const users = await prisma.user.findMany({
    take: firstLine + secondLine + thirdLine,
    skip: randomSkip,
  });

  return (
    <div className={className}>
      <Orbit
        speed={100}
        radius={400}
        items={users.slice(0, firstLine).map((user) => {
          return (
            <Link href={`/users/${user.id}`} key={user.id}>
              <Image
                className="rounded-full"
                key={user.id}
                src={user.imageUrl}
                alt={user.displayName}
                width={50}
                height={50}
              />
            </Link>
          );
        })}
      ></Orbit>
      <Orbit
        speed={140}
        radius={325}
        items={users.slice(firstLine, firstLine + secondLine).map((user) => {
          try {
            return (
              <Link href={`/users/${user.id}`} key={user.id}>
                <Image
                  className="rounded-full"
                  key={user.id}
                  src={user.imageUrl}
                  alt={user.displayName}
                  width={40}
                  height={40}
                />
              </Link>
            );
          } catch {
            return null;
          }
        })}
      ></Orbit>
      <Orbit
        speed={180}
        radius={250}
        items={users.slice(firstLine + secondLine, firstLine + secondLine + thirdLine).map((user) => {
          return (
            <Link href={`/users/${user.id}`} key={user.id}>
              {/* <Image
                className="rounded-full"
                key={user.id}
                src={user.imageUrl}
                alt={user.displayName}
                width={20}
                height={20}
              /> */}
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.imageUrl} alt={user.id} />
                <AvatarFallback className="bg-slate-900 text-white font-semibold">{user.displayName[0]}</AvatarFallback>
              </Avatar>
            </Link>
          );
        })}
      />
    </div>
  );
};

export default MultipleOrbit;
