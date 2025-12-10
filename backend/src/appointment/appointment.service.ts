import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId?: string) {
    // Verifica se o serviço existe
    const service = await this.prisma.service.findUnique({
      where: { id: createAppointmentDto.serviceId },
    });

    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    // Verifica se o barbeiro existe
    const barber = await this.prisma.barber.findUnique({
      where: { id: createAppointmentDto.barberId },
    });

    if (!barber) {
      throw new Error('Barbeiro não encontrado');
    }

    // Verifica se o horário está disponível
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        barberId: createAppointmentDto.barberId,
        date: createAppointmentDto.date,
        time: createAppointmentDto.time,
        status: {
          in: ['confirmed'],
        },
      },
    });

    if (existingAppointment) {
      throw new Error('Horário já está reservado');
    }

    // Cria o agendamento
    const appointmentData: any = {
      serviceId: createAppointmentDto.serviceId,
      barberId: createAppointmentDto.barberId,
      date: createAppointmentDto.date,
      time: createAppointmentDto.time,
      status: 'pending',
    };

    // Se tem userId, associa ao usuário
    if (userId) {
      appointmentData.userId = userId;
    } else {
      // Caso contrário, salva name e phone
      appointmentData.name = createAppointmentDto.name;
      appointmentData.phone = createAppointmentDto.phone;
    }

    const appointment = await this.prisma.appointment.create({
      data: appointmentData,
      include: {
        service: true,
        barber: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return appointment;
  }

  async findAll(date?: string) {
    const where: any = {};

    if (date) {
      where.date = date;
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        service: true,
        barber: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        time: 'asc',
      },
    });
  }

  async findByUser(userId: string, status?: string, limit?: number) {
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      include: {
        service: true,
        barber: true,
      },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
      ...(limit && { take: limit }),
    });

    return appointments;
  }

  async cancel(id: string, userId: string) {
    // Verifica se o agendamento existe e pertence ao usuário
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!appointment) {
      return null;
    }

    // Atualiza o status para cancelled
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
      include: {
        service: true,
        barber: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updatedAppointment;
  }
}

