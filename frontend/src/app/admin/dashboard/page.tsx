"use client"

import { useAtomValue } from "jotai"
import { appointmentsAtom, barbersAtom } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Scissors, AlertCircle, Calendar, DollarSign } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboardPage() {
  const appointments = useAtomValue(appointmentsAtom)
  const barbers = useAtomValue(barbersAtom)

  // Calculate statistics
  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a) => a.status === "completed").length
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled").length
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length
  const cancellationRate = totalAppointments > 0 ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1) : "0"

  // Calculate revenue
  const totalRevenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => {
      const price = Number.parseFloat(a.price.replace("R$", "").replace(",", ".").trim())
      return sum + price
    }, 0)

  // Most booked services
  const serviceCounts = appointments.reduce(
    (acc, appointment) => {
      acc[appointment.service] = (acc[appointment.service] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topServices = Object.entries(serviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([service, count]) => ({
      service,
      count,
    }))

  // Appointments by month (mock data for demonstration)
  const monthlyData = [
    { month: "Jan", appointments: 45, revenue: 3150 },
    { month: "Fev", appointments: 52, revenue: 3640 },
    { month: "Mar", appointments: 48, revenue: 3360 },
    { month: "Abr", appointments: 61, revenue: 4270 },
    { month: "Mai", appointments: 55, revenue: 3850 },
    { month: "Jun", appointments: 67, revenue: 4690 },
    { month: "Jul", appointments: 72, revenue: 5040 },
    { month: "Ago", appointments: 68, revenue: 4760 },
    { month: "Set", appointments: 75, revenue: 5250 },
    { month: "Out", appointments: 82, revenue: 5740 },
  ]

  // Status distribution for pie chart
  const statusData = [
    { name: "Confirmados", value: confirmedAppointments, color: "#f97316" },
    { name: "Concluídos", value: completedAppointments, color: "#22c55e" },
    { name: "Cancelados", value: cancelledAppointments, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do desempenho da barbearia</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Este mês: 82 agendamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Serviços concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Cancelamento</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancellationRate}%</div>
            <p className="text-xs text-muted-foreground">{cancelledAppointments} cancelamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Serviços concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos por Mês</CardTitle>
            <CardDescription>Número de clientes atendidos mensalmente</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                appointments: {
                  label: "Agendamentos",
                  color: "#f97316",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="appointments" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Agendamentos</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                confirmed: {
                  label: "Confirmados",
                  color: "#f97316",
                },
                completed: {
                  label: "Concluídos",
                  color: "#22c55e",
                },
                cancelled: {
                  label: "Cancelados",
                  color: "#ef4444",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Serviços Mais Agendados
          </CardTitle>
          <CardDescription>Top 5 serviços mais populares</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topServices.map((item, index) => {
              const total = appointments.length
              const percentage = ((item.count / total) * 100).toFixed(1)
              return (
                <div key={item.service} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{item.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.count} agendamentos ({percentage}%)
                      </p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Barbers Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho dos Barbeiros</CardTitle>
          <CardDescription>Número de atendimentos por profissional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {barbers.map((barber) => {
              const barberAppointments = appointments.filter(
                (a) => a.barber === barber.name && a.status === "completed",
              )
              const count = barberAppointments.length
              const maxCount = Math.max(
                ...barbers.map(
                  (b) => appointments.filter((a) => a.barber === b.name && a.status === "completed").length,
                ),
              )
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

              return (
                <div key={barber.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{barber.name}</p>
                      <p className="text-sm text-muted-foreground">{count} atendimentos</p>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
