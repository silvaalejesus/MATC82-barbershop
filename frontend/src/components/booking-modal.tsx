"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAtom, useAtomValue } from "jotai"
import { 
  bookingModalOpenAtom, 
  selectedServiceAtom, 
  selectedBarberAtom, 
  barbersAtom,   // Dados reais do backend
  servicesAtom,  // Dados reais do backend
  userAtom       // Usuário logado
} from "@/lib/store"
import { fetcher } from "@/lib/api" // Importar o fetcher
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, User, Loader2 } from "lucide-react"

export function BookingModal() {
  const [open, setOpen] = useAtom(bookingModalOpenAtom)
  
  // Ler dados dos Atoms (povoados pela API)
  const services = useAtomValue(servicesAtom)
  const barbers = useAtomValue(barbersAtom)
  const user = useAtomValue(userAtom)

  const selectedService = useAtomValue(selectedServiceAtom)
  const selectedBarber = useAtomValue(selectedBarberAtom)
  
  const [step, setStep] = useState(1)
  
  // Estado para os horários dinâmicos
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: selectedService || "",
    barber: selectedBarber || "",
    date: "",
    time: "",
  })

  // 1. Preencher dados do usuário automaticamente ao abrir
  useEffect(() => {
    if (open && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || ""
      }))
    }
  }, [open, user])

  // 2. Buscar Horários Disponíveis no Backend
  useEffect(() => {
    // Só busca se tiver Barbeiro e Data selecionados e estivermos no passo 2
    if (formData.barber && formData.date && step === 2) {
      setIsLoadingSlots(true)
      setAvailableSlots([]) // Limpa anteriores

      // A data do input type="date" já vem como YYYY-MM-DD, perfeito para o backend
      const queryDate = formData.date; 

      fetcher(`/availability?barberId=${formData.barber}&date=${queryDate}`)
        .then((data) => {
          setAvailableSlots(data.timeSlots || [])
        })
        .catch((err) => {
          console.error("Erro ao buscar disponibilidade:", err)
          setAvailableSlots([])
        })
        .finally(() => setIsLoadingSlots(false))
    }
  }, [formData.barber, formData.date, step])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Formatar payload para a API
      const payload = {
        serviceId: formData.service,
        barberId: formData.barber,
        date: formData.date, // Já está em YYYY-MM-DD
        time: formData.time, // Já está em HH:MM
        name: formData.name,
        phone: formData.phone,
      }

      // Envia userId na query string se estiver logado
      const endpoint = user?.id 
        ? `/appointments?userId=${user.id}` 
        : `/appointments`

      await fetcher(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      alert("Agendamento realizado com sucesso!")
      setOpen(false)
      // Resetar formulário
      setStep(1)
      setFormData({ name: "", phone: "", service: "", barber: "", date: "", time: "" })
      
    } catch (error) {
      console.error(error)
      alert("Erro ao realizar agendamento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (step === 1 && formData.service && formData.barber) {
      setStep(2)
    } else if (step === 2 && formData.date && formData.time) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  // Encontrar objetos completos para exibição baseados no ID selecionado
  const selectedServiceData = services.find((s) => s.id === formData.service)
  const selectedBarberData = barbers.find((b) => b.id === formData.barber)

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setStep(1)
          setFormData(prev => ({ ...prev, date: "", time: "", service: "", barber: "" }))
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Agendar Horário - Etapa {step} de 3
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Seleção de Serviço e Barbeiro */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-foreground text-lg font-semibold">Escolha o Serviço</Label>
                <RadioGroup
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <div className="grid gap-3">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={service.id} id={service.id} />
                        <Label
                          htmlFor={service.id}
                          className="flex-1 flex items-center justify-between cursor-pointer p-3 border border-border rounded-lg hover:bg-accent"
                        >
                          <div>
                            <p className="font-semibold text-foreground">{service.name}</p>
                            {/* Ajuste conforme o retorno do seu backend (duration ou durationMinutes) */}
                            <p className="text-sm text-muted-foreground">{service.duration} min</p>
                          </div>
                          <span className="font-bold text-primary">R$ {service.price}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-foreground text-lg font-semibold">Escolha o Barbeiro</Label>
                <RadioGroup
                  value={formData.barber}
                  onValueChange={(value) => setFormData({ ...formData, barber: value })}
                >
                  <div className="grid gap-3">
                    {barbers.map((barber) => (
                      <div key={barber.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={barber.id} id={barber.id} />
                        <Label
                          htmlFor={barber.id}
                          className="flex-1 flex items-center gap-3 cursor-pointer p-3 border border-border rounded-lg hover:bg-accent"
                        >
                          <img
                            src={barber.imageUrl || "/placeholder.svg"} // Usar imageUrl se vier do back
                            alt={barber.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{barber.name}</p>
                            <p className="text-sm text-muted-foreground">{barber.role}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="button"
                onClick={handleNext}
                disabled={!formData.service || !formData.barber}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Próximo
              </Button>
            </div>
          )}

          {/* Step 2: Seleção de Data e Hora (INTEGRADO COM BACKEND) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-accent/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{selectedBarberData?.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedServiceData?.name}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Selecione a Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value, time: "" })} // Limpa hora ao mudar data
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Selecione o Horário
                </Label>
                
                {isLoadingSlots ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Buscando horários...
                  </div>
                ) : !formData.date ? (
                  <p className="text-sm text-muted-foreground py-4">Por favor, selecione uma data primeiro.</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-destructive py-4">Não há horários disponíveis nesta data.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        type="button"
                        variant={formData.time === slot ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, time: slot })}
                        className={formData.time === slot ? "bg-primary text-primary-foreground" : "bg-transparent"}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1 bg-transparent">
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!formData.date || !formData.time}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmação e Dados Pessoais */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-accent/50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{selectedBarberData?.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">{selectedServiceData?.name}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formData.date && new Date(formData.date + 'T00:00:00').toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formData.time}
                  </div>
                </div>
                <div className="text-sm font-bold text-primary mt-2">
                   Valor: R$ {selectedServiceData?.price}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div className="flex gap-3">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1 bg-transparent">
                  Voltar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirmando...</>
                  ) : (
                    "Confirmar Agendamento"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}