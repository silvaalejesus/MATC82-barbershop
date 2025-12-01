"use client"

import { Provider } from "jotai"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { barbersData } from "@/lib/store"
import { Facebook, Instagram, Twitter, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSetAtom } from "jotai"
import { bookingModalOpenAtom, selectedBarberAtom } from "@/lib/store"
import { BookingModal } from "@/components/booking-modal"
import { Header } from "@/components/header"

function BarbersContent() {
  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom)
  const setSelectedBarber = useSetAtom(selectedBarberAtom)

  const handleBookBarber = (barberId: string) => {
    setSelectedBarber(barberId)
    setBookingModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Nossos Barbeiros</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Conheça nossa equipe de profissionais experientes e dedicados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {barbersData.map((barber) => (
              <Card key={barber.id} className="bg-card border-border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-96">
                  <img
                    src={barber.image || "/placeholder.svg"}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-sm font-semibold">5.0</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{barber.name}</h3>
                  <p className="text-muted-foreground mb-4">{barber.role}</p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-foreground mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {barber.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 mb-4">
                    <a href="#" className="text-foreground hover:text-primary transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-foreground hover:text-primary transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-foreground hover:text-primary transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>

                  <Button
                    onClick={() => handleBookBarber(barber.id)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Agendar com {barber.name.split(" ")[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BookingModal />
    </div>
  )
}

export default function BarbersPage() {
  return (
    <Provider>
      <BarbersContent />
    </Provider>
  )
}
