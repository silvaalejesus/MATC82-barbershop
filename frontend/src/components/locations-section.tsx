import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

const locations = [
  {
    name: "Unidade Centro",
    address: "Rua Principal, 123 - Centro",
    city: "São Paulo - SP",
    image: "/modern-barbershop-interior-luxury.jpg",
  },
  {
    name: "Unidade Zona Sul",
    address: "Av. Paulista, 456 - Bela Vista",
    city: "São Paulo - SP",
    image: "/barbershop-interior-vintage-chair.jpg",
  },
]

export function LocationsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Nossas Unidades</h2>
          <p className="text-muted-foreground">Encontre a unidade mais próxima de você</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {locations.map((location) => (
            <Card key={location.name} className="bg-background border-border overflow-hidden">
              <div className="relative h-64">
                <img
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{location.name}</h3>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{location.address}</p>
                      <p>{location.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
