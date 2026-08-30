import Navbar from "@/components/Navbar";

import AboutPreview from "@/components/AboutPreview";
import Skills from "@/components/Skills";
import ContactPreview from "@/components/ContactPreview";
import Footer from "@/components/Footer";
import Projects from "./components/Projects";
import FeedbackSection from "@/components/FeedbackSection";
import PortfolioHero from "./components/PortfolioHero";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <PortfolioHero />

        <Projects />

        <AboutPreview />
        <Skills />
        <ContactPreview />

        {/* Feedback loaded from Firestore */}
        <FeedbackSection />
      </main>

      <Footer />
    </>
  );
}