"use client"

import { useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { barberSchedulesAtom, barbersAtom } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar } from "lucide-react"

export default function ScheduleManagementPage() {
  const [schedules, setSchedules] = useAtom(barberSchedulesAtom)
  const barbers = useAtomValue(barbersAtom)
  const [selectedBarberId, setSelectedBarberId] = useState(schedules[0]?.barberId || "")

  const selectedSchedule = schedules.find((s) => s.barberId === selectedBarberId)

  const handleToggleDay = (dayOfWeek: number, isAvailable: boolean) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.barberId === selectedBarberId
          ? {
              ...schedule,
              schedule: schedule.schedule.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, isAvailable } : day)),
            }
          : schedule,
      ),
    )
  }

  const handleTimeChange = (
    dayOfWeek: number,
    field: "startTime" | "endTime" | "breakStart" | "breakEnd",
    value: string,
  ) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.barberId === selectedBarberId
          ? {
              ...schedule,
              schedule: schedule.schedule.map((day) =>
                day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day,
              ),
            }
          : schedule,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciamento de Horários</h1>
        <p className="text-muted-foreground">Defina os dias e horários disponíveis para cada barbeiro</p>
      </div>

      <Tabs value={selectedBarberId} onValueChange={setSelectedBarberId}>
        <TabsList className="grid w-full grid-cols-3">
          {schedules.map((schedule) => (
            <TabsTrigger key={schedule.barberId} value={schedule.barberId}>
              {schedule.barberName}
            </TabsTrigger>
          ))}
        </TabsList>

        {schedules.map((schedule) => (
          <TabsContent key={schedule.barberId} value={schedule.barberId} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Horários de {schedule.barberName}
                </CardTitle>
                <CardDescription>Configure os dias e horários de trabalho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {schedule.schedule.map((day) => (
                  <div key={day.dayOfWeek} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Label htmlFor={`day-${day.dayOfWeek}`} className="text-base font-semibold min-w-[100px]">
                          {day.dayName}
                        </Label>
                        <Switch
                          id={`day-${day.dayOfWeek}`}
                          checked={day.isAvailable}
                          onCheckedChange={(checked) => handleToggleDay(day.dayOfWeek, checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {day.isAvailable ? "Disponível" : "Indisponível"}
                        </span>
                      </div>
                    </div>

                    {day.isAvailable && (
                      <div className="grid grid-cols-2 gap-4 pl-[116px]">
                        <div className="space-y-2">
                          <Label htmlFor={`start-${day.dayOfWeek}`} className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Início
                          </Label>
                          <Input
                            id={`start-${day.dayOfWeek}`}
                            type="time"
                            value={day.startTime}
                            onChange={(e) => handleTimeChange(day.dayOfWeek, "startTime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`end-${day.dayOfWeek}`} className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Fim
                          </Label>
                          <Input
                            id={`end-${day.dayOfWeek}`}
                            type="time"
                            value={day.endTime}
                            onChange={(e) => handleTimeChange(day.dayOfWeek, "endTime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`break-start-${day.dayOfWeek}`} className="text-sm text-muted-foreground">
                            Início do Intervalo
                          </Label>
                          <Input
                            id={`break-start-${day.dayOfWeek}`}
                            type="time"
                            value={day.breakStart || ""}
                            onChange={(e) => handleTimeChange(day.dayOfWeek, "breakStart", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`break-end-${day.dayOfWeek}`} className="text-sm text-muted-foreground">
                            Fim do Intervalo
                          </Label>
                          <Input
                            id={`break-end-${day.dayOfWeek}`}
                            type="time"
                            value={day.breakEnd || ""}
                            onChange={(e) => handleTimeChange(day.dayOfWeek, "breakEnd", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
