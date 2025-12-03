"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAtom, useAtomValue } from "jotai"
import { isAuthenticatedAtom, appointmentsAtom, type Appointment } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Scissors, User, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Provider } from "jotai"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft } from "lucide-react"



function AppointmentsPage() {
function AppointmentsPage() {
  const router = useRouter()
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const [appointments, setAppointments] = useAtom(appointmentsAtom)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setCancelDialogOpen(true)
  }

  const handleCancelConfirm = () => {
    if (selectedAppointment) {
      setAppointments(
        appointments.map((apt) => (apt.id === selectedAppointment ? { ...apt, status: "cancelled" } : apt)),
      )
      setCancelDialogOpen(false)
      setSelectedAppointment(null)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  const confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed")
  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled")

  const renderAppointment = (appointment: Appointment, showActions = false) => (
    <div key={appointment.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Scissors className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">{appointment.service}</h3>
            <Badge
              variant={
                appointment.status === "confirmed"
                  ? "default"
                  : appointment.status === "cancelled"
                    ? "destructive"
                    : "secondary"
              }
              className="ml-2"
            >
              {appointment.status === "confirmed"
                ? "Confirmado"
                : appointment.status === "cancelled"
                  ? "Cancelado"
                  : "Concluído"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{appointment.barber}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(appointment.date).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{appointment.time}</span>
            </div>
          </div>

          <p className="text-sm font-semibold text-foreground">{appointment.price}</p>
        </div>

        {showActions && appointment.status === "confirmed" && (
          <Button variant="destructive" size="sm" onClick={() => handleCancelClick(appointment.id)}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
      <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-2">
            Meus Agendamentos
          </h1>
          <p className="text-muted-foreground">Gerencie seus agendamentos e histórico</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">Próximos ({confirmedAppointments.length})</TabsTrigger>
            <TabsTrigger value="completed">Concluídos ({completedAppointments.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados ({cancelledAppointments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Próximos Agendamentos</CardTitle>
                <CardDescription className="text-muted-foreground">Seus agendamentos confirmados</CardDescription>
              </CardHeader>
              <CardContent>
                {confirmedAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {confirmedAppointments.map((appointment) => renderAppointment(appointment, true))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Você não tem agendamentos próximos</p>
                    <Button
                 className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => router.push("/")}
                >
                  Agendar Agora
                </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Histórico de Agendamentos</CardTitle>
                <CardDescription className="text-muted-foreground">Seus agendamentos concluídos</CardDescription>
              </CardHeader>
              <CardContent>
                {completedAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {completedAppointments.map((appointment) => renderAppointment(appointment))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scissors className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Nenhum agendamento concluído ainda</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cancelled">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Agendamentos Cancelados</CardTitle>
                <CardDescription className="text-muted-foreground">Seus agendamentos cancelados</CardDescription>
              </CardHeader>
              <CardContent>
                {cancelledAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {cancelledAppointments.map((appointment) => renderAppointment(appointment))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum agendamento cancelado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Barbershop Info Card */}
        <Card className="bg-card border-border mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">Informações da Barbearia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Endereço</p>
                <p className="text-sm text-muted-foreground">Rua das Flores, 123 - Centro</p>
                <p className="text-sm text-muted-foreground">São Paulo, SP - CEP 01234-567</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Horário de Funcionamento</p>
                <p className="text-sm text-muted-foreground">Segunda a Sexta: 9h às 19h</p>
                <p className="text-sm text-muted-foreground">Sábado: 9h às 17h</p>
                <p className="text-sm text-muted-foreground">Domingo: Fechado</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Contato</p>
                <p className="text-sm text-muted-foreground">Telefone: (11) 3456-7890</p>
                <p className="text-sm text-muted-foreground">WhatsApp: (11) 98765-4321</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Cancelar Agendamento</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent">Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AppointmentsPage