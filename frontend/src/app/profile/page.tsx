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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/api";

// Importe o appointmentsAtom mas vamos usá-lo apenas para leitura ou atualizar localmente
import { isAuthenticatedAtom, userAtom } from "@/lib/store";
import { useAtom, useAtomValue } from "jotai";

import {
  ArrowRight,
  Calendar,
  Clock,
  Mail,
  Phone,
  Scissors,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  // Estado local para agendamentos desta página
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Verificar Autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // 2. Buscar Dados Reais (Usuário e Agendamentos)
  useEffect(() => {
    if (user?.id) {
      // a) Atualizar dados do usuário
      fetcher(`/users/me?userId=${user.id}`)
        .then((data) => {
          setUser(data);
          // Atualiza o form com os dados frescos
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
          });
        })
        .catch((err) => console.error("Erro ao carregar perfil:", err));

      // b) Buscar agendamentos para a lista de "Recentes"
      // Usamos o limit=3 se o seu backend suportar, senão faz slice no front
      fetcher(`/appointments/me?userId=${user.id}&limit=3`)
        .then((data) => {
          // Garante que é um array antes de setar
          if (Array.isArray(data)) {
            setRecentAppointments(data.slice(0, 3));
          }
        })
        .catch((err) => console.error("Erro ao buscar agendamentos:", err));
    }
  }, [user?.id, setUser]); // Removemos 'form' das dependências para evitar loop

  // 3. Função Unificada de Salvar (Conecta o botão 'Salvar' à API)
  const handleSave = async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const updatedUser = await fetcher(`/users/me?userId=${user.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          // email: form.email // Geralmente email é imutável ou requer confirmação
        }),
      });

      setUser(updatedUser); // Atualiza estado global
      setOpen(false); // Fecha modal
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("barber-user-id"); // Limpa a persistência
    setUser(null); // Limpa o estado
    router.push("/login");
  };

  if (!isAuthenticated || !user) return null;

  console.log("User Data:", user);
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Meu Perfil</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="md:col-span-1 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Informações Pessoais
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>

                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                </div>
              </div>

              {/* Email e telefone */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {user.phone || "Sem telefone"}
                  </span>
                </div>
              </div>

              {/* Editar Perfil + Logout */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                  >
                    Editar Perfil
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Perfil</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nome</label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={form.email}
                        disabled // Desabilita edição de email por segurança
                        className="bg-muted"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Telefone</label>
                      <Input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Botão de Logout */}
              <Button
                variant="destructive"
                className="w-full mt-2"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </CardContent>
          </Card>

          {/* Appointments */}
          <Card className="md:col-span-2 bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">
                    Agendamentos Recentes
                  </CardTitle>
                  <CardDescription>Sua atividade recente</CardDescription>
                </div>
                <Link href="/appointments">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    Ver Todos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {recentAppointments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Nenhum agendamento recente.
                  </p>
                ) : (
                  recentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-foreground">
                              {/* Validação caso venha nulo do back */}
                              {appointment.service?.name || "Serviço"}
                            </h3>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                              className="ml-2"
                            >
                              {appointment.status === "confirmed"
                                ? "Confirmado"
                                : appointment.status === "cancelled"
                                ? "Cancelado"
                                : "Concluído"}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>
                                {appointment.barber?.name || "Barbeiro"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(appointment.date).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {/* Ajuste para garantir formatação de hora */}
                                {new Date(appointment.time).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm font-semibold text-foreground">
                            R$ {appointment.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
