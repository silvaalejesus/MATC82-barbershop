import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(barberId: string, date: string): Promise<string[]> {
    const barber = await this.prisma.barber.findUnique({
      where: { id: barberId },
    });

    if (!barber) {
      throw new NotFoundException('Barbeiro não encontrado');
    }

    const searchDate = new Date(date + 'T00:00:00');
    const dayOfWeek = searchDate.getDay();

    const schedule = await this.prisma.barberSchedule.findFirst({
      where: {
        barber_id: barberId,
        day_of_week: dayOfWeek,
      },
    });

    if (!schedule || !schedule.is_available) {
      return [];
    }

    const startTime = this.formatTime(schedule.start_time);
    const endTime = this.formatTime(schedule.end_time);
    const breakStart = schedule.break_start
      ? this.formatTime(schedule.break_start)
      : null;
    const breakEnd = schedule.break_end
      ? this.formatTime(schedule.break_end)
      : null;

    const allSlots = this.generateTimeSlots(
      startTime,
      endTime,
      30, // intervalos de 30 minutos
    );

    const slotsWithoutBreak = this.removeBreakSlots(
      allSlots,
      breakStart,
      breakEnd,
    );

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        barber_id: barberId,
        date: searchDate,
        status: {
          in: ['confirmed'],
        },
      },
      select: {
        time: true,
      },
    });

    const occupiedSlots = new Set(
      existingAppointments.map((apt) => this.formatTime(apt.time)),
    );

    const availableSlots = slotsWithoutBreak.filter(
      (slot) => !occupiedSlots.has(slot),
    );

    return availableSlots;
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC', // Usar UTC para evitar problemas de fuso horário
    });
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    intervalMinutes: number,
  ): string[] {
    const slots: string[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    for (
      let minutes = startMinutes;
      minutes < endMinutes;
      minutes += intervalMinutes
    ) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeSlot = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      slots.push(timeSlot);
    }

    return slots;
  }

  private removeBreakSlots(
    slots: string[],
    breakStart: string | null,
    breakEnd: string | null,
  ): string[] {
    if (!breakStart || !breakEnd) {
      return slots;
    }

    const [breakStartHour, breakStartMin] = breakStart.split(':').map(Number);
    const [breakEndHour, breakEndMin] = breakEnd.split(':').map(Number);

    const breakStartMinutes = breakStartHour * 60 + breakStartMin;
    const breakEndMinutes = breakEndHour * 60 + breakEndMin;

    return slots.filter((slot) => {
      const [hour, min] = slot.split(':').map(Number);
      const slotMinutes = hour * 60 + min;

      return slotMinutes < breakStartMinutes || slotMinutes >= breakEndMinutes;
    });
  }
}
