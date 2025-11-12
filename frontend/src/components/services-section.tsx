"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSetAtom } from "jotai"
import { bookingModalOpenAtom, selectedServiceAtom } from "@/lib/store"

const services = [
  {
    id: "corte-cabelo",
    name: "Corte de Cabelo",
    price: "R$ 50,00",
    image: "/modern-mens-haircut-barbershop.jpg",
    description: "Corte moderno e personalizado",
  },
  {
    id: "barba",
    name: "Barba Completa",
    price: "R$ 40,00",
    image: "/beard-trim-grooming-barbershop.jpg",
    description: "Aparar e modelar a barba",
  },
  {
    id: "combo",
    name: "Corte + Barba",
    price: "R$ 80,00",
    image: "/mens-grooming-haircut-beard-combo.jpg",
    description: "Pacote completo com desconto",
  },
]

export function ServicesSection() {
  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom)
  const setSelectedService = useSetAtom(selectedServiceAtom)

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId)
    setBookingModalOpen(true)
  }

  return (
    <section id="servicos" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Serviços</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Oferecemos uma variedade de serviços para atender todas as suas necessidades de estilo e cuidados pessoais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="bg-background border-border overflow-hidden">
              <div className="relative h-64">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{service.name}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <p className="text-3xl font-bold text-primary">{service.price}</p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={() => handleBookService(service.id)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Agendar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
