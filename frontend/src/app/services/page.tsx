"use client";

import { BookingModal } from "@/components/booking-modal";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { bookingModalOpenAtom, selectedServiceAtom } from "@/lib/store";
import { useSetAtom } from "jotai";
import { Loader2, Scissors } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Interface baseada no retorno do Prisma Service
interface ServiceFromAPI {
  id: string;
  name: string;
  price: string; // Vem como string/decimal do JSON
  durationMinutes: number;
  description: string | null;
  imageUrl: string | null;
}

export default function ServicesPage() {
  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom);
  const setSelectedService = useSetAtom(selectedServiceAtom);

  const [services, setServices] = useState<ServiceFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Busca os dados da API ao carregar a página
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("http://localhost:3001/api/services");
        if (!response.ok) {
          console.log("Response status:", response);
          throw new Error("Falha ao carregar serviços");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os serviços. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId);
    setBookingModalOpen(true);
  };

  // Ícone padrão caso não tenha lógica específica de ícone no banco
  const DefaultIcon = Scissors;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Nossos Serviços
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Oferecemos uma variedade completa de serviços para atender todas
              as suas necessidades de estilo e cuidados pessoais
            </p>
            <div className="mt-6">
              <Link href="/plans">
                <Button variant="outline" size="lg" className="bg-transparent">
                  Ver Planos de Assinatura
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-8 bg-destructive/10 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="bg-card border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-56">
                    <img
                      src={service.imageUrl || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {service.durationMinutes} min
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <DefaultIcon className="h-5 w-5 text-primary" />
                      <h3 className="text-2xl font-bold text-foreground">
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {service.description || "Sem descrição disponível."}
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      {/* Formata o preço vindo da API */}
                      {Number(service.price).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
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
              ))}
            </div>
          )}
        </div>
      </div>
      <BookingModal />
    </div>
  );
}
