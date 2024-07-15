"use client";

import { useState, useEffect } from "react";
import AddReason from "@/components/panel/reasons/add-reason";
import ReasonComponent from "@/components/panel/reasons/reason";
import { Reason } from "@prisma/client";

const ReasonsPage = () => {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReasons = async () => {
      setIsLoading(true);
      const response = await fetch("/api/reasons");
      const data = await response.json();
      setReasons(data);
      setIsLoading(false);
    };
    fetchReasons();
  }, []);

  const addReason = (newReason: Reason) => {
    setReasons((prevReasons) => [...prevReasons, newReason]);
  };

  const deleteReason = (id: string) => {
    setReasons((prevReasons) => prevReasons.filter((reason) => reason.id !== id));
  };

  const reasonsFields = reasons.map((reason) => (
    <ReasonComponent key={reason.id} reason={reason} onDelete={deleteReason} />
  ));

  const fields = () => {
    if (isLoading) {
      return <div className="text-center text-white/50">Chargement...</div>;
    }
    if (reasons.length === 0) {
      return <div className="text-center text-white/50">Aucun motif trouvé</div>;
    }
    
    return reasonsFields;
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center overflow-y-auto h-screen pt-8 px-2">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <div className="text-2xl font-semibold w-full">Motifs</div>
        <AddReason onAdd={addReason} />
        <div className="w-full flex flex-col gap-2">
          {fields()}
        </div>
      </div>
    </div>
  );
};

export default ReasonsPage;
