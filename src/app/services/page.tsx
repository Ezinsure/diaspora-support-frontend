import type { Metadata } from "next";
import Services from "@/src/components/site/Services";
import Options from "@/src/components/site/Options";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Optional professional support for Rwandans abroad with passport, birth certificate, national ID and notification processes.",
};

export default function ServicesPage() {
  return (
    <main>
      <Services as="h1" />
      <Options />
    </main>
  );
}