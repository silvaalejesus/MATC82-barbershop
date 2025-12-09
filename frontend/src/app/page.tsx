"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai"; // 1. Importar o hook do Jotai
import { servicesAtom, barbersAtom } from "@/lib/store"; // 2. Importar os atoms do seu store
import { fetcher } from "@/lib/api";

// Imports dos componentes
import { AboutSection } from "@/components/about-section";
import { BookingModal } from "@/components/booking-modal";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { LocationsSection } from "@/components/locations-section";
import { ServicesSection } from "@/components/services-section";
import { TeamSection } from "@/components/team-section";

export default function Home() {
  // 3. Obter as funções de "setter" dos atoms
  const setServices = useSetAtom(servicesAtom);
  const setBarbers = useSetAtom(barbersAtom);

  useEffect(() => {
    // Agora as funções setServices e setBarbers existem e vão atualizar o estado global
    fetcher("/services")
      .then((data) => setServices(data))
      .catch((err) => console.error("Erro ao buscar serviços:", err));

    fetcher("/barbers")
      .then((data) => setBarbers(data))
      .catch((err) => console.error("Erro ao buscar barbeiros:", err));
  }, [setServices, setBarbers]); // Boas práticas: incluir setters nas dependências

  return (
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
      <BookingModal />
    </div>
  );
}