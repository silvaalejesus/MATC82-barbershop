"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSetAtom } from "jotai"
import { userAtom } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Provider } from "jotai"

function RegisterForm() {
  const router = useRouter()
  const setUser = useSetAtom(userAtom)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!")
      return
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    }

    setUser(newUser)
    router.push("/profile")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-foreground">Cadastro</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Crie sua conta para agendar seus horários
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nome Completo
              </Label>
              <Input
                id="name"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmar Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="bg-background border-border text-foreground"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Criar Conta
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Voltar para o início
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Provider>
      <RegisterForm />
    </Provider>
  )
}
