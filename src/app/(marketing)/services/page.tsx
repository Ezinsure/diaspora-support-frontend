import Options from "@/components/marketing/Options";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Optional professional support for Rwandans abroad with passport, birth certificate, national ID and notification processes.",
};

export default function ServicesPage() {
  return (
    <main>
      <Options />
    </main>
  );
}