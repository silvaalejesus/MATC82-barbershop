"use client"

import type React from "react"

import { useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { bookingModalOpenAtom, selectedServiceAtom, barbersData, servicesData } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, User } from "lucide-react"

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
]

export function BookingModal() {
  const [open, setOpen] = useAtom(bookingModalOpenAtom)
  const selectedService = useAtomValue(selectedServiceAtom)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: selectedService || "",
    barber: "",
    date: "",
    time: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", formData)
    alert("Agendamento realizado com sucesso!")
    setOpen(false)
    setStep(1)
    setFormData({ name: "", phone: "", service: "", barber: "", date: "", time: "" })
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

  const selectedServiceData = servicesData.find((s) => s.id === formData.service)
  const selectedBarberData = barbersData.find((b) => b.id === formData.barber)

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setStep(1)
          setFormData({ name: "", phone: "", service: "", barber: "", date: "", time: "" })
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Agendar Horário - Etapa {step} de 3</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Service and Barber Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-foreground text-lg font-semibold">Escolha o Serviço</Label>
                <RadioGroup
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <div className="grid gap-3">
                    {servicesData.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={service.id} id={service.id} />
                        <Label
                          htmlFor={service.id}
                          className="flex-1 flex items-center justify-between cursor-pointer p-3 border border-border rounded-lg hover:bg-accent"
                        >
                          <div>
                            <p className="font-semibold text-foreground">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.duration}</p>
                          </div>
                          <span className="font-bold text-primary">{service.price}</span>
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
                    {barbersData.map((barber) => (
                      <div key={barber.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={barber.id} id={barber.id} />
                        <Label
                          htmlFor={barber.id}
                          className="flex-1 flex items-center gap-3 cursor-pointer p-3 border border-border rounded-lg hover:bg-accent"
                        >
                          <img
                            src={barber.image || "/placeholder.svg"}
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

          {/* Step 2: Date and Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-accent/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{selectedBarberData?.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedServiceData?.name} - {selectedServiceData?.duration}
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
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
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

          {/* Step 3: Personal Information */}
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
                    {formData.date && new Date(formData.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formData.time}
                  </div>
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
                <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Confirmar Agendamento
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
