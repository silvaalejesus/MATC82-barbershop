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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher } from "@/lib/api";
import { barbersAtom, type Barber } from "@/lib/store";
import { useAtomValue, useSetAtom } from "jotai";
import { Mail, Pencil, Phone, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function BarbersManagementPage() {
  // const [barbers, setBarbers] = useAtom(barbersAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    specialties: "",
    status: "active" as "active" | "inactive",
  });
  const setBarbers = useSetAtom(barbersAtom);
  const barbers = useAtomValue(barbersAtom);

  const handleOpenDialog = (barber?: Barber) => {
    if (barber) {
      setEditingBarber(barber);
      setFormData({
        name: barber.name,
        email: barber.email,
        phone: barber.phone,
        role: barber.role,
        specialties: barber.specialties.join(", "),
        status: barber.status,
      });
    } else {
      setEditingBarber(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        specialties: "",
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetcher("/barbers")
      .then((data) => setBarbers(data))
      .catch((e) => console.error("Erro ao carregar barbeiros:", e));
  }, [setBarbers]);

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este barbeiro?")) {
      setBarbers(barbers.filter((b) => b.id !== id));
    }
  };

  const handleCreateBarber = async (formData: any) => {
    const adminId = "id-do-admin-aqui";

    try {
      const newBarber = await fetcher(`/barbers?adminId=${adminId}`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialties: formData.specialties, 
          imageUrl: formData.image, 
        }),
      });

      setBarbers((prev) => [...prev, newBarber]);
      alert("Barbeiro criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar barbeiro.");
    }
  };

  const handleUpdateBarber = async (barberId: string, formData: any) => {
    const adminId = "id-do-admin-aqui"; 

    try {
      const updatedBarber = await fetcher(
        `/barbers/${barberId}?adminId=${adminId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            specialties: formData.specialties,
            status: formData.status, 
          }),
        }
      );

      setBarbers((prev) =>
        prev.map((b) => (b.id === barberId ? updatedBarber : b))
      );
      alert("Barbeiro atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar barbeiro.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Barbeiros</h1>
          <p className="text-muted-foreground">
            Cadastre e gerencie os profissionais da barbearia
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Barbeiro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBarber ? "Editar Barbeiro" : "Novo Barbeiro"}
              </DialogTitle>
              <DialogDescription>
                {editingBarber
                  ? "Atualize as informações do barbeiro"
                  : "Cadastre um novo profissional"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateBarber} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Ex: Barbeiro Master"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialties">
                  Especialidades (separadas por vírgula)
                </Label>
                <Input
                  id="specialties"
                  value={formData.specialties}
                  onChange={(e) =>
                    setFormData({ ...formData, specialties: e.target.value })
                  }
                  placeholder="Ex: Corte de Cabelo, Barba, Combo Premium"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingBarber ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <Card key={barber.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={barber.image || "/placeholder.svg"}
                      alt={barber.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{barber.name}</CardTitle>
                    <CardDescription>{barber.role}</CardDescription>
                  </div>
                </div>
                <Badge
                  variant={barber.status === "active" ? "default" : "secondary"}
                >
                  {barber.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {barber.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {barber.phone}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {barber.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleOpenDialog(barber)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive bg-transparent"
                  onClick={() => handleDelete(barber.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
