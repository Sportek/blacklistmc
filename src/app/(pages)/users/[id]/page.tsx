import BaseSpacing from "@/components/base";
import BlacklistCard from "@/components/blacklist";
import Gradient from "@/components/landing/gradient";
import StatusBadge from "@/components/user/status-badge";
import prisma from "@/lib/prisma";
import { UserStatus } from "@/types/types";
import Image from "next/image";
import { notFound } from "next/navigation";

const getPreventionMessage = (status: UserStatus) => {
  switch (status) {
    case UserStatus.BLACKLISTED:
      return "Attention, cette personne est actuellement blacklist. Nous déconseillons fortement de travailler avec elle. Si vous avez été victime d'une arnaque ou d'un préjudice venant de cette personne, n'hésitez pas à créer un ticket sur notre Discord.";
    case UserStatus.NOT_BLACKLISTED:
      return "Cette personne n'est pas blacklistée. Bien que nous n'ayons aucune raison de douter de son intégrité, nous vous recommandons de toujours faire preuve de prudence lors de vos transactions. Vérifiez les avis des autres utilisateurs pour vous assurer de la fiabilité de cette personne.";
    case UserStatus.OLD_BLACKLISTED:
      return "Cette personne a déjà été blacklistée par le passé. Bien qu'elle ait été réintégrée, nous vous recommandons de faire preuve de prudence lors de vos interactions. Vérifiez les avis récents des autres utilisateurs et soyez vigilant dans vos transactions. Si vous rencontrez des problèmes, n'hésitez pas à créer un ticket sur notre Discord.";
  }
};

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
      Blacklist: {
        include: {
          user: true,
          votes: true,
          _count: {
            select: {
              votes: true,
            },
          },
          proofs: true,
        },
      },
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
      <BaseSpacing className="z-10 flex flex-col items-center justify-center gap-10 max-w-4xl flex-grow">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-4 items-center flex-wrap">
            <Image className="rounded-full" src={user.imageUrl} alt="Avatar" width={48} height={48} />
            <div className="font-extrabold text-4xl">{user.displayName}</div>
            <div className="text-2xl font-normal">@{user.username}</div>
            <StatusBadge user={user} />
          </div>
          {getPreventionMessage(userStatusJson.status)}
        </div>
        {user.Blacklist.length > 0 && (
          <div className="w-full flex flex-col gap-4">
            <div className="font-bold text-xl">Blacklist récents</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {user.Blacklist.map((blacklist) => {
                return <BlacklistCard key={blacklist.id} blacklist={blacklist} user={blacklist.user} />;
              })}
            </div>
          </div>
        )}
      </BaseSpacing>
    </>
  );
};

export default UserPage;
