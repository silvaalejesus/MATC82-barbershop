"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetcher } from "@/lib/api";
import {
  bookingModalOpenAtom,
  userAtom,
  servicesAtom,
  barbersAtom,
} from "@/lib/store";
import { useAtomValue, useSetAtom } from "jotai";
import { Calendar, Clock, User as UserIcon, Plus } from "lucide-react"; // Importei o ícone Plus
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { BookingModal } from "@/components/booking-modal";
import { Header } from "@/components/header"; // 1. Importar Header
import { Footer } from "@/components/footer"; // 1. Importar Footer

interface Appointment {
  id: string;
  service?: { name: string; price: string | number };
  barber?: { name: string };
  date: string;
  time: string;
  status: string;
  price: string | number;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const user = useAtomValue(userAtom);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const setBookingModalOpen = useSetAtom(bookingModalOpenAtom);
  const setServices = useSetAtom(servicesAtom);
  const setBarbers = useSetAtom(barbersAtom);

  // Busca Serviços e Barbeiros
  useEffect(() => {
    fetcher("/services")
      .then((data) => setServices(data))
      .catch((err) => console.error("Erro ao buscar serviços:", err));

    fetcher("/barbers")
      .then((data) => setBarbers(data))
      .catch((err) => console.error("Erro ao buscar barbeiros:", err));
  }, [setServices, setBarbers]);

  const fetchAppointments = useCallback(() => {
    if (!user) return;

    setLoading(true);
    fetcher(`/appointments/me?userId=${user.id}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.error("Formato de agendamentos inválido:", data);
          setAppointments([]);
        }
      })
      .catch((err) => console.error("Erro ao buscar agendamentos:", err))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchAppointments();
  }, [user, router, fetchAppointments]);

  const handleCancel = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    try {
      await fetcher(`/appointments/${id}/cancel?userId=${user?.id}`, {
        method: "PATCH",
      });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: "cancelled" } : app
        )
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao cancelar agendamento. Tente novamente.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 2. Adicionado o Header */}
      <Header />

      <main className="flex-1 container mx-auto py-10 px-4 pt-24">
        {/* 3. Cabeçalho da página com o Botão sempre visível */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Meus Agendamentos</h1>
          
          <Button onClick={() => setBookingModalOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground animate-pulse">
              Carregando seus agendamentos...
            </p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-border border-dashed">
            <p className="text-muted-foreground mb-6 text-lg">
              Você ainda não tem agendamentos.
            </p>
            {/* O botão aqui é opcional agora, já que tem um no topo, mas pode manter como "call to action" extra */}
            <Button variant="outline" onClick={() => setBookingModalOpen(true)}>
              Agendar Agora
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl font-bold leading-tight">
                      {appointment.service?.name || "Serviço"}
                    </CardTitle>
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {appointment.status === "confirmed"
                        ? "Confirmado"
                        : appointment.status === "cancelled"
                        ? "Cancelado"
                        : "Concluído"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(appointment.date).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UserIcon className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-medium">
                        {appointment.barber?.name || "Barbeiro"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-foreground">
                        {new Date(appointment.time).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary mt-2">
                      <span>
                        R${" "}
                        {Number(appointment.price).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>

                  {appointment.status === "confirmed" && (
                    <div className="pt-4 mt-auto">
                      <Button
                        variant="outline"
                        className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Cancelar Agendamento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <BookingModal onSuccess={fetchAppointments} />
      </main>

      {/* 4. Adicionado o Footer */}
      <Footer />
    </div>
  );
}