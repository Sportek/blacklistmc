"use client";
import BaseSpacing from "@/components/base";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

const Panel = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard/users");
  }, [router]);
  return <BaseSpacing>Panel</BaseSpacing>;
};

export default Panel;
