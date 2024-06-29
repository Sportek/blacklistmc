import ReactSwagger from "@/components/swagger";
import { Metadata } from "next";
import { getApiDocs } from "../../lib/swagger";

export const metadata: Metadata = {
  title: "API Docs",
  description: "API Documentation with Swagger for Nextjs",
};

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container w-full flex flex-col gap-4 justify-between max-w-6xl p-4 z-10 bg-slate-400 h-full">
      <ReactSwagger spec={spec} />
    </section>
  );
}
