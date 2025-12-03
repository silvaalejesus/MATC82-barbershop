"use client"

import { Provider } from "jotai"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Crown, Star, Zap } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SupportModal } from "@/components/support-modal"
import { PaymentModal } from "@/components/payment-modal"
import { useAtom } from "jotai"
import { supportModalOpenAtom, paymentModalOpenAtom, selectedPlanAtom } from "@/lib/store"
import { Header } from "@/components/header"

const plans = [
  {
    id: "basico",
    name: "Básico",
    price: "R$ 120,00",
    period: "/mês",
    description: "Ideal para quem quer manter o visual sempre em dia",
    icon: Zap,
    color: "text-blue-500",
    features: [
      "3 cortes de cabelo por mês",
      "10% de desconto em outros serviços",
      "Agendamento prioritário",
      "Suporte via WhatsApp",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 200,00",
    period: "/mês",
    description: "O plano mais popular para cuidados completos",
    icon: Star,
    color: "text-primary",
    features: [
      "4 cortes de cabelo por mês",
      "2 barbas completas por mês",
      "20% de desconto em outros serviços",
      "Agendamento prioritário",
      "Produtos premium inclusos",
      "Suporte via WhatsApp",
    ],
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: "R$ 350,00",
    period: "/mês",
    description: "Experiência completa e exclusiva",
    icon: Crown,
    color: "text-yellow-500",
    features: [
      "Cortes ilimitados",
      "Barbas ilimitadas",
      "Sobrancelha incluída",
      "30% de desconto em outros serviços",
      "Agendamento prioritário VIP",
      "Produtos premium inclusos",
      "Atendimento exclusivo",
      "Bebidas premium durante o atendimento",
    ],
    popular: false,
  },
]

function PlansPage() {
  const [, setPaymentModalOpen] = useAtom(paymentModalOpenAtom)
  const [, setSupportModalOpen] = useAtom(supportModalOpenAtom)
  const [, setSelectedPlan] = useAtom(selectedPlanAtom)

  const handleSubscribeNow = (planId: string) => {
    setSelectedPlan(planId)
    setPaymentModalOpen(true)
  }

  const handleSupportClick = () => {
    setSupportModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Planos de Assinatura</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Escolha o plano ideal para você e economize nos seus serviços favoritos
            </p>
            <div className="mt-6">
              <Link href="/services">
                <Button variant="outline" size="lg" className="bg-transparent">
                  Ver Todos os Serviços
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon
              return (
                <Card
                  key={plan.id}
                  className={`bg-card border-border relative ${
                    plan.popular ? "ring-2 ring-primary shadow-xl scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className={`h-8 w-8 ${plan.color}`} />
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground mt-2 leading-relaxed">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button
                      onClick={() => handleSubscribeNow(plan.id)}
                      className={`w-full ${
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-transparent border-border hover:bg-accent"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Assinar Agora
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-card border-border max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Dúvidas sobre os planos?</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Entre em contato conosco pelo WhatsApp e tire todas as suas dúvidas
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center">
                <Button
                  onClick={handleSupportClick}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Falar com Atendente
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlansPage