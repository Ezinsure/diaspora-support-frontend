import HowItWorks from "@/src/lib/HowItWorks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Contact us, tell us what you need, and our team guides you and follows up on your request. Here is what to expect when you ask for our help.",
};

const HowItWorksPage = () => {
  return (
    <main>
      <HowItWorks as="h1" />
    </main>
  );
}
export default HowItWorksPage;