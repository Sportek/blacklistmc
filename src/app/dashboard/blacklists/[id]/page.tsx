import Card from "@/components/landing/card";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { ArrowLongRightIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

interface BlacklistPageProps {
  params: {
    id: string;
  };
}
const BlacklistPage = async ({ params }: BlacklistPageProps) => {

  const blacklist = await prisma.blacklist.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      user: true,
      votes: {
        include: {
          moderator: true,
        },
      },
      proofs: true
    },
  });


  if (!blacklist) {
    return notFound();
  }






  return (
    <div className="w-full flex flex-col gap-2 items-center overflow-y-auto h-screen pt-8 px-2">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <div className="text-2xl font-semibold w-full">Blacklist</div>
        <Card className="flex flex-col gap-2">
          <div className="text-xl font-semibold">
            {blacklist.title}{" "}
            <div className="text-sm font-thin text-white/70 flex flex-row items-center gap-2">
              <div>{blacklist.createdAt.toLocaleDateString()}</div>
              <ArrowLongRightIcon className="w-4 h-4" />
              <div>{blacklist.expireAt?.toLocaleDateString() ?? "Définitif"}</div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2">
            <Image src={blacklist.user.imageUrl} alt="User" width={32} height={32} className="rounded-full" />
            <div className="flex flex-row items-center gap-1">
              <div className="text-sm font-semibold">{blacklist.user.displayName}</div>
              <div className="text-xs">@{blacklist.user.username}</div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-lg font-semibold">Description</div>
            <div className="text-base">{blacklist.description}</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">Différentes preuves ({blacklist.proofs.length})</div>
            {blacklist.proofs.map((proof) => (
              <Card key={proof.id} className="flex flex-row items-center gap-2">
                <div>{proof.name}</div>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-lg font-semibold">
              Votes des {blacklist.voteState === "BLACKLIST" ? "superviseurs" : "supports"} ({blacklist.votes.length})
            </div>
            {blacklist.votes.map((vote) => (
              <Card
                key={vote.id}
                className={cn("flex flex-row items-center gap-2", vote.vote ? "bg-green-500" : "bg-red-500")}
              >
                <Image src={vote.moderator.imageUrl} alt="Moderator" width={32} height={32} className="rounded-full" />
                <div>{vote.moderator.displayName}</div>
                <div>@{vote.moderator.username}</div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BlacklistPage;