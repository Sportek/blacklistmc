"use client";

import Card from "@/components/landing/card";
import { toast } from "@/components/ui/use-toast";
import fetcher from "@/lib/fetcher";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/solid";
import { Proof } from "@prisma/client";
import Image from "next/image";
import useSWR from "swr";

interface ProofPageProps {
  params: {
    id: string;
    proofId: string;
  };
}

const ProofPage = ({ params }: ProofPageProps) => {
  const proof = useSWR<Proof>(`/api/users/onsenfou/blacklists/${params.id}/proofs/${params.proofId}`, fetcher);
  const link = useSWR<{ url: string }>(
    `/api/users/onsenfou/blacklists/${params.id}/proofs/${params.proofId}/link`,
    fetcher
  );

  const handleDownload = async () => {
    if (!(link.data && proof.data)) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de la preuve",
      });
      return;
    }
    const response = await fetch(link.data.url);
    if (!response.ok) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de la preuve",
      });
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = proof.data.name;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Téléchargement",
      description: "La preuve a été téléchargée avec succès",
    });
  };


  const handleChangeVisibility = async () => {
    const response = await fetch(`/api/users/onsenfou/blacklists/${params.id}/proofs/${params.proofId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPublic: !proof.data?.isPublic }),
    });
    if (!response.ok) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la preuve",
      });
    }

    proof.mutate();
    toast({
      title: "Mise à jour",
      description: "La preuve a été mise à jour avec succès",
    });
  };


  const displayProof = () => {

    if(!(link.data && proof.data)) {
      return <div>Chargement...</div>;
    }


    if (proof.data?.type === "IMAGE") {
      return <Image src={link.data.url} alt="Preuve" width={500} height={200} />;
    }

    if(proof.data.type === "VIDEO") {
      return (
        <video width={500} height={300} controls>
          <source src={link.data.url} type="video/mp4" />
          <track kind="captions" srcLang="fr" label="Français" />
          Votre navigateur ne supporte pas la balise vidéo.
        </video>
      );
    }

    return <div>Ce format n&apos;est pas supporté, vous devez le télécharger.</div>;
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center overflow-y-auto h-screen pt-8 px-2">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <div className="text-2xl font-semibold w-full">Preuve</div>
        <Card className="flex flex-col gap-8">
          <div className="flex flex-row gap-2 items-center">
            {proof.data?.isPublic ? <LockOpenIcon className="w-6 h-6" /> : <LockClosedIcon className="w-6 h-6" />}
            <div className="text-xl font-semibold">{proof.data?.name}</div>
          </div>
          <div className="flex flex-col gap-2 w-full items-center justify-center">
            <Card className="p-2">{displayProof()}</Card>
          </div>
          <div className="flex flex-row gap-2">
            <button onClick={handleDownload}>
              <Card className="flex items-center gap-2 w-fit hover:bg-opacity-30 transition-all duration-75 ease-in-out">
                <ArrowDownOnSquareIcon className="w-6 h-6" />
                <div>Télécharger</div>
              </Card>
            </button>
            <button onClick={handleChangeVisibility}>
              <Card className="flex items-center gap-2 w-fit hover:bg-opacity-30 transition-all duration-75 ease-in-out">
                {proof.data?.isPublic ? (
                  <>
                    <LockClosedIcon className="w-6 h-6" />
                    <div>Définir comme privé</div>
                  </>
                ) : (
                  <>
                    <LockOpenIcon className="w-6 h-6" />
                    <div>Définir comme public</div>
                  </>
                )}
              </Card>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProofPage;
