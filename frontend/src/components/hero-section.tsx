"use client"

import { Button } from "@/components/ui/button"
import { useSetAtom } from "jotai"
import { bookingModalOpenAtom } from "@/lib/store"
import Image from "next/image"

export function HeroSection() {
  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              ESTILO É UM REFLEXO DA SUA ATITUDE E SUA PERSONALIDADE
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Agende seu horário na melhor barbearia da cidade
            </p>
            <div>
              <Button
                size="lg"
                onClick={() => setBookingModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
              >
                Agendar Horário
              </Button>
            </div>
          </div>

          <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src="/professional-barber-cutting-mens-hair-modern-barbe.jpeg"
              alt="Barbeiro profissional realizando corte"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
