
import Options from "@/src/components/marketing/Options";
import HowItWorks from "./landing/HowItWorks";
import LandingPage from "./landing/page";
import Services from "./landing/Services";
import Pricing from "@/src/components/marketing/Pricing";

const HomePage = () => {
  return (
    <main>
      <LandingPage />
      <Services />
      <Options />
      <HowItWorks />
        <Pricing />
    </main>
  );
}
export default HomePage;          
