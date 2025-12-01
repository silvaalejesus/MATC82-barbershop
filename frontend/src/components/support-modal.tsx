"use client"

import type React from "react"

import { useAtom } from "jotai"
import { supportModalOpenAtom } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { MessageCircle, Phone, Mail } from "lucide-react"

export function SupportModal() {
  const [isOpen, setIsOpen] = useAtom(supportModalOpenAtom)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Falar com Atendente
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha o formulário abaixo e nossos atendentes entrarão em contato
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Mensagem Enviada!</h3>
            <p className="text-muted-foreground">
              Obrigado! Entraremos em contato em breve através do email ou WhatsApp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Nome Completo
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@example.com"
                required
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground">
                WhatsApp / Telefone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(11) 9 8765-4321"
                required
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <Label htmlFor="subject" className="text-foreground">
                Assunto
              </Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Dúvida sobre planos"
                required
                className="bg-input text-foreground border-border"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-foreground">
                Mensagem
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Descreva sua dúvida ou solicitação..."
                required
                rows={4}
                className="bg-input text-foreground border-border resize-none"
              />
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm">
              <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Contato Rápido</p>
                <div className="text-muted-foreground mt-1 space-y-1">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> (11) 3456-7890
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> atendimento@barbearia.com.br
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Enviar Mensagem
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
