"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetcher } from "@/lib/api";
import { userAtom } from "@/lib/store"; // Importar o atom de usuário
import { useSetAtom } from "jotai"; // Importar hook do Jotai
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);// Hook para atualizar o usuário global
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Login no Backend
      const response = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      // O backend retorna: { user: { id: "...", ... }, accessToken: "..." }
      const user = response.user 

      // 2. Salvar sessão no navegador (ESSENCIAL PARA A PERSISTÊNCIA)
      localStorage.setItem("barber-user-id", user.id)

      // 3. Atualizar estado global
      setUser(user)

      alert(`Bem-vindo, ${user.name}!`)
      
      // Redirecionamento
      if (user.role === 'admin' || user.role === 'barber') {
        router.push("/admin/dashboard")
      } else {
        router.push("/") // Ou /profile
      }

    } catch (error) {
      console.error(error)
      alert("Credenciais inválidas")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Entre para gerenciar seus agendamentos
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
