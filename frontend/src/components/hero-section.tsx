"use client"

import { Button } from "@/components/ui/button"
import { useSetAtom } from "jotai"
import { bookingModalOpenAtom } from "@/lib/store"

export function HeroSection() {
  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=modern+barbershop+interior+dark+moody)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          ESTILO É UM REFLEXO DA SUA ATITUDE E SUA PERSONALIDADE
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Agende seu horário na melhor barbearia da cidade
        </p>
        <Button
          size="lg"
          onClick={() => setBookingModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
        >
          Agendar Horário
        </Button>
      </div>
    </section>
  )
}
