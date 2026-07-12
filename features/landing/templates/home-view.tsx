"use client";

import Navbar from "../components/navbar";
import Header from "../components/header";
import Footer from "../components/footer";
import Recomment from "../components/recomment";
import HowIsWorks from "../components/howisworks";
import Security from "../components/security";
import UseCases from "../components/use-cases";
import Pricing from "../components/pricing";
import FAQ from "../components/faq";
import CTA from "../components/cta";

export default function HomeView() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <Header />
      <Recomment />
      <UseCases />
      <HowIsWorks />
      <Security />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
