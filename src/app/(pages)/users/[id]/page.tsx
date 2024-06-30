import BaseSpacing from "@/components/base";
import Gradient from "@/components/landing/gradient";
import StatusBadge from "@/components/user/status-badge";
import prisma from "@/lib/prisma";
import { UserStatus } from "@/types/types";
import Image from "next/image";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: {
    id: string;
  };
}
const UserPage = async ({ params }: UserPageProps) => {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      Blacklist: true,
    },
  });

  if (!user) notFound();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/status`);
  const userStatusJson = (await response.json()) as { status: UserStatus };
  return (
    <>
      <div className="absolute inset-0 z-0 max-h-[100vh] top-[-200px]">
        <Gradient />
      </div>
      <BaseSpacing className="z-10 flex flex-col items-center justify-center">
        <div className="max-w-3xl">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4 items-center flex-wrap">
              <Image className="rounded-full" src={user.imageUrl} alt="Avatar" width={48} height={48} />
              <div className="font-extrabold text-4xl">{user.displayName}</div>
              <div className="text-2xl font-normal">@{user.username}</div>
              <StatusBadge user={user} />
            </div>
            {userStatusJson.status === UserStatus.BLACKLISTED ? (
              <div>
                Attention, cette personne est actuellement blacklist. Nous déconseillons fortement de travailler avec
                elle. Si vous avez été victime d&apos;une arnaque ou d&apos;un préjudice venant de cette personne,
                n&apos;hésitez pas à créer un ticket sur notre Discord.
              </div>
            ) : (
              <div>
                Cette personne n&apos;est pas blacklistée. Bien que nous n&apos;ayons aucune raison de douter de son
                intégrité, nous vous recommandons de toujours faire preuve de prudence lors de vos transactions.
                Vérifiez les avis des autres utilisateurs pour vous assurer de la fiabilité de cette personne.
              </div>
            )}
          </div>
          {user.Blacklist.length > 0 && (
            <div>
              <div>
                {user.Blacklist.map((blacklist) => (
                  <div key={blacklist.id}>{blacklist.title}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </BaseSpacing>
    </>
  );
};

export default UserPage;
