import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

interface ScheduleDay {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string;
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
    // Estatísticas gerais de agendamentos
    const totalAppointments = await this.prisma.appointment.count();

    const completedAppointments = await this.prisma.appointment.count({
      where: { status: 'completed' },
    });

    const cancelledAppointments = await this.prisma.appointment.count({
      where: { status: 'cancelled' },
    });

    // Calcula receita total (apenas agendamentos completados)
    const completedAppts = await this.prisma.appointment.findMany({
      where: { status: 'completed' },
      include: { service: true },
    });

    const totalRevenue = completedAppts.reduce(
      (sum, apt) => sum + Number(apt.service.price),
      0,
    );

    // Busca dados dos últimos 6 meses
    const monthlyData = await this.getMonthlyData();

    const confirmedCount = await this.prisma.appointment.count({
      where: { status: 'confirmed' },
    });

    const statusData = [
      {
        name: 'Confirmados',
        value: confirmedCount,
        color: '#10b981',
      },
      {
        name: 'Cancelados',
        value: cancelledAppointments,
        color: '#ef4444',
      },
      {
        name: 'Completados',
        value: completedAppointments,
        color: '#3b82f6',
      },
    ];

    // Top 5 serviços mais agendados
    const topServices = await this.getTopServices();

    // Performance dos barbeiros
    const barberPerformance = await this.getBarberPerformance();

    return {
      stats: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue: Number(totalRevenue.toFixed(2)),
      },
      monthlyData,
      statusData,
      topServices,
      barberPerformance,
    };
  }

  /**
   * Calcula dados mensais dos últimos 6 meses
   */
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

    // Agrupa por mês
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

  /**
   * Retorna os 5 serviços mais agendados
   */
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

  /**
   * Calcula a performance de cada barbeiro
   */
  private async getBarberPerformance() {
    const barbers = await this.prisma.barber.findMany({
      where: {
        status: 'active',
      },
      include: {
        appointments: {
          where: { status: 'completed' },
        },
      },
      orderBy: {
        name: 'asc',
      },
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
   * Retorna as agendas de todos os barbeiros
   */
  async getAllSchedules() {
    const barbers = await this.prisma.barber.findMany({
      include: {
        schedules: {
          orderBy: { day_of_week: 'asc' },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return barbers.map((barber) => ({
      barberId: barber.id,
      barberName: barber.name,
      barberEmail: barber.email,
      barberPhone: barber.phone,
      barberStatus: barber.status,
      schedule: barber.schedules.map((sched) => ({
        id: sched.id,
        dayOfWeek: sched.day_of_week,
        isAvailable: sched.is_available,
        startTime: sched.start_time,
        endTime: sched.end_time,
        breakStart: sched.break_start,
        breakEnd: sched.break_end,
      })),
    }));
  }

  /**
   * PUT /api/admin/schedules/:barberId
   * Atualiza a agenda completa de um barbeiro
   */
  async updateBarberSchedule(barberId: string, schedule: ScheduleDay[]) {
    // Verifica se o barbeiro existe
    const barber = await this.prisma.barber.findUnique({
      where: { id: barberId },
    });

    if (!barber) {
      return null;
    }

    // Remove todas as agendas antigas do barbeiro
    await this.prisma.barberSchedule.deleteMany({
      where: { barber_id: barberId },
    });

    // Cria as novas agendas
    const createdSchedules = await Promise.all(
      schedule.map((day) =>
        this.prisma.barberSchedule.create({
          data: {
            barber_id: barberId,
            day_of_week: day.dayOfWeek,
            is_available: day.isAvailable,
            start_time: day.startTime,
            end_time: day.endTime,
            break_start: day.breakStart || null,
            break_end: day.breakEnd || null,
          },
        }),
      ),
    );

    return {
      barberId: barber.id,
      barberName: barber.name,
      barberEmail: barber.email,
      schedule: createdSchedules,
    };
  }

  /**
   * GET /api/admin/clients
   * Lista todos os clientes com suas estatísticas
   */
  async getAllClients(search?: string) {
    const where: Prisma.UserWhereInput = {
      role: 'custumer', // Filtra apenas usuários comuns (não admin/barber)
    };

    // Adiciona filtro de busca se fornecido
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
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Computa estatísticas para cada cliente
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

      // Pega o último agendamento
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
   * Lista todos os agendamentos com filtros opcionais
   */
  async getAllAppointments(status?: string) {
    const where: Prisma.AppointmentWhereInput = {};

    // Adiciona filtro de status se fornecido
    if (status) {
      where.status = status as any;
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            specialties: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
    });

    // Formata a resposta incluindo dados do cliente
    return appointments.map((apt) => ({
      id: apt.id,
      serviceId: apt.service_id,
      barberId: apt.barber_id,
      userId: apt.user_id,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      createdAt: apt.createdAt,
      // Dados do serviço
      service: apt.service,
      // Dados do barbeiro
      barber: apt.barber,
      // Dados do cliente (pode ser do user ou campos diretos)
      clientName: apt.user?.name || apt.name,
      clientEmail: apt.user?.email || null,
      clientPhone: apt.user?.phone || apt.phone,
      clientId: apt.user?.id || null,
    }));
  }
}
