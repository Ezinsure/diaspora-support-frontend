import TrackPage from "@/components/marketing/track/TrackPage";

export const metadata = {
  title: "Track your request",
  description: "See where your request is, your quotation, and pay online.",
};

export default function Track() {
  return (
    <section className="bg-gray-50/60 px-4 py-12 sm:py-16">
      <TrackPage />
    </section>
  );
}