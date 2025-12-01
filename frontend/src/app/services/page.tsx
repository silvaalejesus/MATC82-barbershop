"use client"

import { Provider } from "jotai"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSetAtom } from "jotai"
import { bookingModalOpenAtom, selectedServiceAtom } from "@/lib/store"
import { Scissors, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { BookingModal } from "@/components/booking-modal"

const allServices = [
  {
    id: "corte-cabelo",
    name: "Corte de Cabelo",
    price: "R$ 45,00",
    duration: "45 min",
    image: "/modern-mens-haircut.jpg",
    description: "Corte moderno e personalizado de acordo com seu estilo",
    icon: Scissors,
  },
  {
    id: "barba",
    name: "Barba Completa",
    price: "R$ 35,00",
    duration: "30 min",
    image: "/beard-grooming-barbershop.jpg",
    description: "Aparar, modelar e finalizar a barba com produtos premium",
    icon: Sparkles,
  },
  {
    id: "bigode",
    name: "Bigode",
    price: "R$ 20,00",
    duration: "15 min",
    image: "/mustache-grooming.jpg",
    description: "Modelagem e finalização do bigode",
    icon: User,
  },
  {
    id: "sobrancelha",
    name: "Sobrancelha",
    price: "R$ 25,00",
    duration: "20 min",
    image: "/eyebrow-grooming-men.jpg",
    description: "Design e limpeza de sobrancelhas masculinas",
    icon: Sparkles,
  },
  {
    id: "combo-completo",
    name: "Corte + Barba",
    price: "R$ 70,00",
    duration: "75 min",
    image: "/mens-grooming-combo.jpg",
    description: "Pacote completo com corte de cabelo e barba",
    icon: Scissors,
  },
  {
    id: "combo-premium",
    name: "Combo Premium",
    price: "R$ 95,00",
    duration: "90 min",
    image: "/premium-barbershop-service.jpg",
    description: "Corte, barba, sobrancelha e tratamento capilar",
    icon: Sparkles,
  },
]

function ServicesContent() {
  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom)
  const setSelectedService = useSetAtom(selectedServiceAtom)

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId)
    setBookingModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">Nossos Serviços</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Oferecemos uma variedade completa de serviços para atender todas as suas necessidades de estilo e cuidados
            pessoais
          </p>
          <div className="mt-6">
            <Link href="/plans">
              <Button variant="outline" size="lg" className="bg-transparent">
                Ver Planos de Assinatura
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service) => {
            const Icon = service.icon
            return (
              <Card
                key={service.id}
                className="bg-card border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {service.duration}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">{service.name}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <p className="text-3xl font-bold text-primary">{service.price}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={() => handleBookService(service.id)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Agendar Agora
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
      <BookingModal />
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Provider>
      <ServicesContent />
    </Provider>
  )
}
