"use client";

import Navbar from "../components/navbar";
import Header from "../components/header";
import Footer from "../components/footer";
import Recomment from "../components/recomment";
import HowIsWorks from "../components/howisworks";
import Security from "../components/security";
export default function HomeView() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <Header />
      <Recomment />
      <HowIsWorks />
      <Security />
      <Footer />
    </>
  );
}
