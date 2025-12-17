"use client"

import type React from "react"

import { useAtom } from "jotai"
import { paymentModalOpenAtom, selectedPlanAtom } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"

interface Plan {
  id: string
  name: string
  price: string
  period: string
}

const plans: Record<string, Plan> = {
  basico: { id: "basico", name: "Básico", price: "R$ 120,00", period: "/mês" },
  premium: { id: "premium", name: "Premium", price: "R$ 200,00", period: "/mês" },
  vip: { id: "vip", name: "VIP", price: "R$ 350,00", period: "/mês" },
}

export function PaymentModal() {
  const [isOpen, setIsOpen] = useAtom(paymentModalOpenAtom)
  const [selectedPlan] = useAtom(selectedPlanAtom)
  const [step, setStep] = useState<"form" | "processing" | "success" | "error">("form")
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const plan = selectedPlan ? plans[selectedPlan] : null

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16)
      formattedValue = formattedValue.replace(/(\d{4})/g, "$1 ").trim()
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2)
      }
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3)
    }

    setCardData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("processing")

    setTimeout(() => {
      const randomSuccess = Math.random() > 0.2 // 80% de sucesso
      setStep(randomSuccess ? "success" : "error")
    }, 2500)
  }

  const handleClose = () => {
    if (step !== "processing") {
      setIsOpen(false)
      setStep("form")
      setCardData({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" })
    }
  }

  const handleRetry = () => {
    setStep("form")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Realizar Pagamento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {plan ? `Plano ${plan.name} - ${plan.price}${plan.period}` : "Finalize seu pagamento"}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Valor a pagar:</span>
                <span className="text-2xl font-bold text-foreground">{plan?.price}</span>
              </div>
              <p className="text-xs text-muted-foreground">{plan?.period} (renovação automática)</p>
            </div>

            <div>
              <Label htmlFor="cardName" className="text-foreground">
                Nome no Cartão
              </Label>
              <Input
                id="cardName"
                name="cardName"
                value={cardData.cardName}
                onChange={handleCardChange}
                placeholder="JOÃO SILVA"
                required
                className="bg-input text-foreground border-border uppercase"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-foreground">
                Número do Cartão
              </Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  placeholder="0000 0000 0000 0000"
                  required
                  className="bg-input text-foreground border-border font-mono pr-10"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-foreground">
                  Validade
                </Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM/AA"
                  required
                  className="bg-input text-foreground border-border font-mono"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-foreground">
                  CVV
                </Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleCardChange}
                  placeholder="000"
                  required
                  type="password"
                  className="bg-input text-foreground border-border font-mono"
                />
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex gap-2 text-sm">
              <Lock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">Seu pagamento é seguro e criptografado</p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Confirmar Pagamento
              </Button>
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {step === "processing" && (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Processando Pagamento</h3>
            <p className="text-muted-foreground">Aguarde, estamos processando seu pagamento...</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Pagamento Aprovado!</h3>
            <p className="text-muted-foreground mb-6">
              Seu plano {plan?.name} foi ativado com sucesso. Aproveite seus benefícios!
            </p>
            <Button onClick={handleClose} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Continuar
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Pagamento Recusado</h3>
            <p className="text-muted-foreground mb-6">
              Não conseguimos processar seu pagamento. Verifique os dados e tente novamente.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRetry} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                Tentar Novamente
              </Button>
              <Button onClick={handleClose} variant="outline" className="flex-1 bg-transparent">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
