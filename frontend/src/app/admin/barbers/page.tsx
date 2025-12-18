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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    specialties: "",
    status: "active" as "active" | "inactive",
    image: "", 
  });
  
  const setBarbers = useSetAtom(barbersAtom);
  const barbers = useAtomValue(barbersAtom);

  // --- CORREÇÃO AQUI ---
  const getAdminId = () => {
    if (typeof window === "undefined") return null;
    
    // O Login salva apenas o ID como string na chave "barber-user-id"
    // Não usamos JSON.parse nem "barber-user-session"
    return localStorage.getItem("barber-user-id");
  };
  // ---------------------

  useEffect(() => {
    fetcher("/barbers")
      .then((data) => setBarbers(data))
      .catch((e) => console.error("Erro ao carregar barbeiros:", e));
  }, [setBarbers]);

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
        image: barber.image || "", 
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
        image: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCreateBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminId = getAdminId();
    
    if (!adminId) {
      alert("Sessão inválida ou expirada. Faça login novamente.");
      return;
    }

    try {
      const specialtiesArray = formData.specialties.split(",").map((s) => s.trim()).filter(Boolean);

      if (!formData.image) {
        alert("A URL da imagem é obrigatória.");
        return;
      }

      const newBarber = await fetcher(`/barbers?adminId=${adminId}`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          specialties: specialtiesArray,
          status: formData.status,
          image: formData.image, 
        }),
      });

      setBarbers((prev) => [...prev, newBarber]);
      setIsDialogOpen(false);
      alert("Barbeiro criado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar (Verifique se o usuário é Admin).");
    }
  };

  const handleUpdateBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminId = getAdminId();
    if (!adminId || !editingBarber) return;

    try {
      const specialtiesArray = formData.specialties.split(",").map((s) => s.trim()).filter(Boolean);

      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        specialties: specialtiesArray,
        status: formData.status,
      };

      if (formData.image && formData.image.trim() !== "") {
        payload.image = formData.image;
      }

      const updatedBarber = await fetcher(
        `/barbers/${editingBarber.id}?adminId=${adminId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      setBarbers((prev) =>
        prev.map((b) => (b.id === editingBarber.id ? updatedBarber : b))
      );
      setIsDialogOpen(false);
      alert("Barbeiro atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar (Verifique permissão ou dados).");
    }
  };

  const handleDelete = async (id: string) => {
    const adminId = getAdminId();
    if (!adminId) return;
    
    if (confirm("Remover este barbeiro?")) {
      try {
        await fetcher(`/barbers/${id}?adminId=${adminId}`, { method: "DELETE" });
        setBarbers(barbers.filter((b) => b.id !== id));
      } catch (e) {
        alert("Erro ao remover.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Barbeiros</h1>
          <p className="text-muted-foreground">Cadastre e gerencie os profissionais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Barbeiro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBarber ? "Editar" : "Novo"} Barbeiro</DialogTitle>
              <DialogDescription>Preencha os dados abaixo.</DialogDescription>
            </DialogHeader>
            <form onSubmit={editingBarber ? handleUpdateBarber : handleCreateBarber} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Especialidades (separadas por vírgula)</Label>
                <Input value={formData.specialties} onChange={(e) => setFormData({...formData, specialties: e.target.value})} required />
              </div>

              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {barbers.map((barber) => (
          <Card key={barber.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
                  {barber.imageUrl || barber.image ? (
                    <Image src={barber.imageUrl || barber.image} alt={barber.name} fill className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">IMG</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-base">{barber.name}</CardTitle>
                  <CardDescription className="text-xs">{barber.role}</CardDescription>
                </div>
              </div>
              <Badge variant={barber.status === "active" ? "default" : "secondary"}>{barber.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm mt-4">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4"/> {barber.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4"/> {barber.phone}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {barber.specialties.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>
                ))}
              </div>
              <div className="flex gap-2 pt-2 mt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(barber)}>
                  <Pencil className="mr-2 h-3 w-3"/> Editar
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(barber.id)}>
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}