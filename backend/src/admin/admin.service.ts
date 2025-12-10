import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

interface ScheduleDay {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string; // Vem como string do JSON
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Verifica se o usuário é admin
   */
  async verifyAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === 'admin';
  }

  /**
   * GET /api/admin/dashboard
   * Agrega todos os dados para o dashboard
   */
  async getDashboardData() {
    const totalAppointments = await this.prisma.appointment.count();

    const completedAppointments = await this.prisma.appointment.count({
      where: { status: 'completed' },
    });

    const cancelledAppointments = await this.prisma.appointment.count({
      where: { status: 'cancelled' },
    });

    // Calcula receita total
    const completedAppts = await this.prisma.appointment.findMany({
      where: { status: 'completed' },
      include: { service: true },
    });

    const totalRevenue = completedAppts.reduce(
      (sum, apt) => sum + Number(apt.service.price),
      0,
    );

    const totalClients = await this.prisma.user.count({
      where: { role: 'client' },
    });

    const monthlyData = await this.getMonthlyData();

    const confirmedCount = await this.prisma.appointment.count({
      where: { status: 'confirmed' },
    });

    const statusData = [
      { name: 'Confirmados', value: confirmedCount, color: '#10b981' },
      { name: 'Cancelados', value: cancelledAppointments, color: '#ef4444' },
      { name: 'Completados', value: completedAppointments, color: '#3b82f6' },
    ];

    const topServices = await this.getTopServices();
    const barberPerformance = await this.getBarberPerformance();

    return {
      stats: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalClients,
      },
      monthlyData,
      statusData,
      topServices,
      barberPerformance,
    };
  }

  async getStats() {
    const totalClients = await this.prisma.user.count({
      where: { role: 'client' },
    });

    const completedAppts = await this.prisma.appointment.findMany({
      where: { status: 'completed' },
      include: { service: true },
    });

    const totalRevenue = completedAppts.reduce(
      (sum, apt) => sum + Number(apt.service.price),
      0,
    );

    return {
      totalClients,
      totalRevenue: Number(totalRevenue.toFixed(2)),
    };
  }

  private async getMonthlyData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      include: { service: true },
      orderBy: { createdAt: 'asc' },
    });

    const monthlyMap = new Map<
      string,
      { appointments: number; revenue: number }
    >();

    appointments.forEach((apt) => {
      const date = new Date(apt.createdAt);
      const monthKey = date.toLocaleString('pt-BR', {
        month: 'short',
        year: 'numeric',
      });

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { appointments: 0, revenue: 0 });
      }

      const data = monthlyMap.get(monthKey)!;
      data.appointments++;

      if (apt.status === 'completed') {
        data.revenue += Number(apt.service.price);
      }
    });

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      appointments: data.appointments,
      revenue: Number(data.revenue.toFixed(2)),
    }));
  }

  private async getTopServices() {
    const appointments = await this.prisma.appointment.findMany({
      include: { service: true },
    });

    const serviceCount = new Map<string, number>();

    appointments.forEach((apt) => {
      const serviceName = apt.service.name;
      serviceCount.set(serviceName, (serviceCount.get(serviceName) || 0) + 1);
    });

    return Array.from(serviceCount.entries())
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private async getBarberPerformance() {
    const barbers = await this.prisma.barber.findMany({
      where: { status: 'active' },
      include: {
        appointments: {
          where: { status: 'completed' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return barbers
      .map((barber) => ({
        barberName: barber.name,
        completedCount: barber.appointments.length,
      }))
      .sort((a, b) => b.completedCount - a.completedCount);
  }

  /**
   * GET /api/admin/schedules
   */
  async getAllSchedules() {
    const barbers = await this.prisma.barber.findMany({
      include: {
        schedules: {
          orderBy: { dayOfWeek: 'asc' }, // CORRIGIDO: dayOfWeek
        },
      },
      orderBy: { name: 'asc' },
    });

    return barbers.map((barber) => ({
      barberId: barber.id,
      barberName: barber.name,
      barberEmail: barber.email,
      barberPhone: barber.phone,
      barberStatus: barber.status,
      schedule: barber.schedules.map((sched) => ({
        id: sched.id,
        dayOfWeek: sched.dayOfWeek, // CORRIGIDO
        isAvailable: sched.isAvailable, // CORRIGIDO
        startTime: sched.startTime, // CORRIGIDO
        endTime: sched.endTime, // CORRIGIDO
        breakStart: sched.breakStart, // CORRIGIDO
        breakEnd: sched.breakEnd, // CORRIGIDO
      })),
    }));
  }

  /**
   * PUT /api/admin/schedules/:barberId
   */
  async updateBarberSchedule(barberId: string, schedule: ScheduleDay[]) {
    const barber = await this.prisma.barber.findUnique({
      where: { id: barberId },
    });

    if (!barber) {
      return null;
    }

    // Remove agendas antigas
    await this.prisma.barberSchedule.deleteMany({
      where: { barberId: barberId }, // CORRIGIDO: barberId
    });

    // Converter string de hora 'HH:MM' para Date object
    // Assumindo data arbitrária pois o banco pede DateTime para Time column
    const toDate = (timeStr?: string) => {
      if (!timeStr) return null;
      const [hours, minutes] = timeStr.split(':').map(Number);
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    // Cria as novas agendas
    // Nota: O Prisma Client espera objetos Date para colunas DateTime/@db.Time
    await Promise.all(
      schedule.map((day) =>
        this.prisma.barberSchedule.create({
          data: {
            barberId: barberId, // CORRIGIDO
            dayOfWeek: day.dayOfWeek, // CORRIGIDO
            isAvailable: day.isAvailable, // CORRIGIDO
            startTime: toDate(day.startTime)!,
            endTime: toDate(day.endTime)!,
            breakStart: toDate(day.breakStart),
            breakEnd: toDate(day.breakEnd),
          },
        }),
      ),
    );

    // Retorna a agenda atualizada (busca do banco para garantir formato)
    const updatedSchedules = await this.prisma.barberSchedule.findMany({
      where: { barberId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return {
      barberId: barber.id,
      barberName: barber.name,
      schedule: updatedSchedules,
    };
  }

  /**
   * GET /api/admin/clients
   */
  async getAllClients(search?: string) {
    const where: any = {
      role: 'client', // CORRIGIDO: 'custumer' -> 'client'
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      include: {
        appointments: {
          include: { service: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => {
      const totalAppointments = user.appointments.length;
      const completedAppointments = user.appointments.filter(
        (apt) => apt.status === 'completed',
      ).length;
      const cancelledAppointments = user.appointments.filter(
        (apt) => apt.status === 'cancelled',
      ).length;

      const totalSpent = user.appointments
        .filter((apt) => apt.status === 'completed')
        .reduce((sum, apt) => sum + Number(apt.service.price), 0);

      const sortedAppointments = [...user.appointments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const lastAppointment = sortedAppointments[0];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalSpent: Number(totalSpent.toFixed(2)),
        lastAppointment: lastAppointment?.date || null,
        lastAppointmentStatus: lastAppointment?.status || null,
      };
    });
  }

  /**
   * GET /api/admin/appointments
   */
  async getAllAppointments(status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: {
        service: true,
        barber: true,
        user: true,
      },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
    });

    return appointments.map((apt) => ({
      id: apt.id,
      serviceId: apt.serviceId, // CORRIGIDO
      barberId: apt.barberId, // CORRIGIDO
      userId: apt.userId, // CORRIGIDO
      date: apt.date,
      time: apt.time,
      status: apt.status,
      createdAt: apt.createdAt,
      service: apt.service,
      barber: apt.barber,
      // User pode ser nulo se agendamento foi feito sem cadastro (dependendo da regra)
      // Se seu SQL permite user_id nulo, apt.user pode ser null.
      clientName: apt.user?.name || apt.customerName, // CORRIGIDO: customerName
      clientEmail: apt.user?.email || null,
      clientPhone: apt.user?.phone || apt.customerPhone, // CORRIGIDO: customerPhone
      clientId: apt.user?.id || null,
    }));
  }
}
