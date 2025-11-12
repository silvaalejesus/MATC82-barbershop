"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, userAtom } from "@/lib/store";
import { Provider, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

function LoginForm() {
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let authenticatedUser: User | null = null;

    if (
      formData.email === "admin@barber.com" &&
      formData.password === "admin123"
    ) {
      authenticatedUser = {
        id: "admin-1",
        name: "Administrador",
        email: "admin@barber.com",
        phone: "(11) 99999-9999",
        role: "admin",
      };
    } else if (formData.email.includes("@") && formData.password) {
      authenticatedUser = {
        id: "client-" + Date.now(),
        name: "Cliente Exemplo",
        email: formData.email,
        phone: "(11) 98888-8888",
        role: "client",
      };
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);

      if (
        authenticatedUser.role === "admin" ||
        authenticatedUser.role === "barber"
      ) {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
    } else {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-foreground">
            Login
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Acesse sua conta de cliente ou administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Entrar
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Voltar para o início
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Provider>
      <LoginForm />
    </Provider>
  );
}
