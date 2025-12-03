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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { appointmentsAtom, isAuthenticatedAtom, userAtom } from "@/lib/store";
import { useAtomValue, useSetAtom } from "jotai";

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
  const user = useAtomValue(userAtom);

  const setUser = useSetAtom(userAtom);


  const appointments = useAtomValue(appointmentsAtom);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Verifica login
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Preenche o formulário com o usuário
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  if (!isAuthenticated || !user) return null;

  const recentAppointments = appointments.slice(0, 3);

  // Salvar edição
  function handleSave() {
    setUser({
      name: form.name ?? "",
      email: form.email ?? "",
      id: user.id ?? "",
      role: user.role ?? "",
      phone: form.phone ?? "",
    });

    setOpen(false);
  }

 
  function handleLogout() {
    setUser(null);
    router.push("/login");
  }

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
                  <span className="text-foreground">{user.phone}</span>
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
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
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
                    <Button onClick={handleSave}>Salvar</Button>
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
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Ver Todos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-foreground">
                            {appointment.service}
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
                              : "Concluído"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{appointment.barber}</span>
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
                            <span>{appointment.time}</span>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-foreground">
                          {appointment.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
