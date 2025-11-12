"use client";

import { AboutSection } from "@/components/about-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { LocationsSection } from "@/components/locations-section";
import { ServicesSection } from "@/components/services-section";
import { TeamSection } from "@/components/team-section";
import { Provider } from "jotai";

export default function Home() {
  return (
    <Provider>
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <TeamSection />
          <LocationsSection />
        </main>
        <Footer />
      </div>
    </Provider>
  );
}
