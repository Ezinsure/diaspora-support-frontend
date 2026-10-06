import Options from "../components/site/Options";
import Pricing from "../components/site/Pricing";
import HowItWorks from "./landing/HowItWorks";
import LandingPage from "./landing/page";
import Services from "./landing/Services";

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
