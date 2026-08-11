import HeroSection from "../Pages/HeroSection";
import FeatureSection from "../Pages/FeatureSection"
// import WorkflowSection from "../Pages/WorkflowSection";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      <HeroSection />
      <FeatureSection />
      {/* <WorkflowSection /> */}
    </main>
  );
}

export default Home;