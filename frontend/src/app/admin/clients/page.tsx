"use client";

import { useState } from "react"
import { useAtomValue } from "jotai"
import { clientsAtom, appointmentsAtom } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Search, TrendingUp, TrendingDown, Calendar, Mail, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClientsManagementPage() {
  const clients = useAtomValue(clientsAtom)
  const appointments = useAtomValue(appointmentsAtom)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  )

  const upcomingAppointments = appointments.filter((a) => a.status === "confirmed")

  const calculateCancellationRate = (cancelled: number, total: number) => {
    if (total === 0) return 0
    return ((cancelled / total) * 100).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Clientes</h1>
        <p className="text-muted-foreground">Visualize clientes agendados e taxas de cancelamento</p>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Clientes Agendados</TabsTrigger>
          <TabsTrigger value="all">Todos os Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Agendamentos
              </CardTitle>
              <CardDescription>Lista de clientes com agendamentos confirmados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Barbeiro</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{new Date(appointment.date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell className="font-medium">Cliente #{appointment.id}</TableCell>
                      <TableCell>{appointment.service}</TableCell>
                      <TableCell>{appointment.barber}</TableCell>
                      <TableCell>{appointment.price}</TableCell>
                      <TableCell>
                        <Badge variant="default">Confirmado</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Base de Clientes
                  </CardTitle>
                  <CardDescription>Histórico completo e taxas de cancelamento</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClients.map((client) => {
                  const cancellationRate = calculateCancellationRate(
                    client.cancelledAppointments,
                    client.totalAppointments,
                  )
                  const isHighCancellation = Number.parseFloat(cancellationRate) > 20

                  return (
                    <Card key={client.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="text-lg font-semibold">{client.name}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {client.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {client.phone}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Total de Agendamentos</p>
                                <p className="text-2xl font-bold">{client.totalAppointments}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Concluídos</p>
                                <p className="text-2xl font-bold text-green-600">{client.completedAppointments}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Cancelados</p>
                                <p className="text-2xl font-bold text-red-600">{client.cancelledAppointments}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Taxa de Cancelamento</p>
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`text-2xl font-bold ${isHighCancellation ? "text-red-600" : "text-green-600"}`}
                                  >
                                    {cancellationRate}%
                                  </p>
                                  {isHighCancellation ? (
                                    <TrendingUp className="h-5 w-5 text-red-600" />
                                  ) : (
                                    <TrendingDown className="h-5 w-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Última visita: {new Date(client.lastVisit).toLocaleDateString("pt-BR")}
                              </span>
                              <span className="text-muted-foreground">
                                Cliente desde: {new Date(client.registeredDate).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>

                          {isHighCancellation && (
                            <Badge variant="destructive" className="ml-4">
                              Alta Taxa de Cancelamento
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
