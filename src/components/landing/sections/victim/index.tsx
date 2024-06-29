import BaseSpacing from "@/components/base";
import Link from "next/link";
import Card from "../../card";
import Quadrille from "../../quadrille";

const Victim = () => {
  return (
    <BaseSpacing className="pb-24">
      <div className="w-full h-full flex flex-col sm:flex-row items-center gap-16">
        <Quadrille className="max-w-lg" />
        <div className="flex flex-col gap-8">
          <div className="text-4xl font-extrabold">Avez-vous été victime d&apos;une arnaque?</div>
          <div className="text-sm font-normal">
            Si vous avez été victime d&apos;une arnaque ou d&apos;un préjudice venant d&apos;une personne, nous vous
            invitons vivement à créer un ticket sur notre Discord pour essayer de régler la situation ou pour prévenir
            et éviter que d&apos;autres personnes ne se fassent avoir.
          </div>
          <Link href="https://discord.gg/QUgzUhMBUp" className="w-fit">
            <Card>Rejoindre le Discord</Card>
          </Link>
        </div>
      </div>
    </BaseSpacing>
  );
};

export default Victim;
