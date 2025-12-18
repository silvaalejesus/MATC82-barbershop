"use client"

import { useEffect } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { appointmentsAtom, barbersAtom } from "@/lib/store"
import { fetcher } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Scissors, AlertCircle, Calendar, DollarSign, Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboardPage() {
  const appointments = useAtomValue(appointmentsAtom)
  const barbers = useAtomValue(barbersAtom)
  
  // Setters para atualizar o estado global
  const setAppointments = useSetAtom(appointmentsAtom)
  const setBarbers = useSetAtom(barbersAtom)

  // 1. Buscar dados reais ao carregar a página
  useEffect(() => {
    async function loadData() {
      try {
        const [appointmentsData, barbersData] = await Promise.all([
          fetcher("/appointments"),
          fetcher("/barbers")
        ])
        setAppointments(appointmentsData || [])
        setBarbers(barbersData || [])
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
      }
    }
    loadData()
  }, [setAppointments, setBarbers])

  // --- CÁLCULOS COM DADOS REAIS ---

  const totalAppointments = appointments.length
  const completedAppointments = appointments.filter((a) => a.status === "completed").length
  const cancelledAppointments = appointments.filter((a) => a.status === "cancelled").length
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length
  
  const cancellationRate = totalAppointments > 0 
    ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1) 
    : "0"

  const totalRevenue = appointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => {
      // Garante conversão segura seja string ou number
      const priceVal = Number(a.price) || 0
      return sum + priceVal
    }, 0)

  // Agrupa serviços (Ajustado para acessar o objeto service.name)
  const serviceCounts = appointments.reduce(
    (acc, appointment: any) => {
      const serviceName = appointment.service?.name || "Desconhecido"
      acc[serviceName] = (acc[serviceName] || 0) + 1
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

  // Gera dados mensais dinâmicos baseados nos agendamentos
  const monthlyData = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", 
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ].map((month, index) => {
    // Filtra agendamentos deste mês (ignorando ano para simplificar visualização anual recorrente)
    const appsInMonth = appointments.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === index && a.status !== 'cancelled';
    });

    const revenue = appsInMonth.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

    return {
        month,
        appointments: appsInMonth.length,
        revenue
    }
  });

  const statusData = [
    { name: "Confirmados", value: confirmedAppointments, color: "#f97316" },
    { name: "Concluídos", value: completedAppointments, color: "#22c55e" },
    { name: "Cancelados", value: cancelledAppointments, color: "#ef4444" },
  ].filter(item => item.value > 0) // Só mostra no gráfico se tiver valor

  // Loading state simples se não tiver dados ainda
  if (appointments.length === 0 && barbers.length === 0) {
     // Opcional: retornar um skeleton ou loading, ou apenas deixar renderizar vazio
  }

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
            <p className="text-xs text-muted-foreground">Registrados no sistema</p>
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
            <div className="text-2xl font-bold">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Faturamento bruto</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
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
              className="h-[300px] w-full"
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

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Status dos Agendamentos</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                confirmed: { label: "Confirmados", color: "#f97316" },
                completed: { label: "Concluídos", color: "#22c55e" },
                cancelled: { label: "Cancelados", color: "#ef4444" },
              }}
              className="h-[300px] w-full"
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
              const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0"
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
                (a: any) => a.barber?.name === barber.name && (a.status === "completed" || a.status === "confirmed"),
              )
              const count = barberAppointments.length
              
              // Evita divisão por zero
              const counts = barbers.map(
                  (b) => appointments.filter((a: any) => a.barber?.name === b.name && (a.status === "completed" || a.status === "confirmed")).length
              )
              const maxCount = Math.max(...counts, 1) // Minimo 1 para evitar NaN
              
              const percentage = (count / maxCount) * 100

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