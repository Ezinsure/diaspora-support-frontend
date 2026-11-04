
import Options from "@/components/marketing/Options";
import HowItWorks from "./landing/HowItWorks";
import LandingPage from "./landing/page";
import Services from "./landing/Services";
import Pricing from "@/components/marketing/Pricing";
import Testimonials, { PREVIEW_STORIES } from "@/components/marketing/Testimanials";

const HomePage = () => {
  return (
    <main>
      <LandingPage />
      <Services />
      <Options />
      <HowItWorks />
      <Testimonials stories={PREVIEW_STORIES} />
        <Pricing />
    </main>
  );
}
export default HomePage;          
