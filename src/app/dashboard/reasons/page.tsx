"use client";

import { useState, useEffect } from "react";
import AddReason from "@/components/panel/reasons/add-reason";
import ReasonComponent from "@/components/panel/reasons/reason";
import { Reason } from "@prisma/client";

const ReasonsPage = () => {
  const [reasons, setReasons] = useState<Reason[]>([]);

  useEffect(() => {
    const fetchReasons = async () => {
      const response = await fetch("/api/reasons");
      const data = await response.json();
      setReasons(data);
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

  return (
    <div className="w-full flex flex-col gap-2 items-center overflow-y-auto h-screen pt-8 px-2">
      <div className="max-w-3xl w-full flex flex-col gap-4">
        <div className="text-2xl font-semibold w-full">Motifs</div>
        <AddReason onAdd={addReason} />
        <div className="w-full flex flex-col gap-2">
          {reasonsFields.length > 0 ? (
            reasonsFields
          ) : (
            <div className="text-center text-gray-500">Aucun motif trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReasonsPage;
