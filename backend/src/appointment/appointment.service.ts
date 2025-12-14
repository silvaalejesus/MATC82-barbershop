import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

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

    const dateObject = new Date(`${createAppointmentDto.date}T00:00:00Z`);
    const timeObject = new Date(`1970-01-01T${createAppointmentDto.time}:00Z`);
    if (isNaN(dateObject.getTime()) || isNaN(timeObject.getTime())) {
      throw new Error('Formato de data ou hora inválido');
    }

    // Verifica se o horário está disponível
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        barberId: createAppointmentDto.barberId,
        date: dateObject, // Usar objeto Date
        time: timeObject, // Usar objeto Date
        status: { in: ['confirmed'] },
      },
    });

    if (existingAppointment) {
      throw new Error('Horário já está reservado');
    }
    // Cria o agendamento
    const appointmentData: any = {
      serviceId: createAppointmentDto.serviceId,
      barberId: createAppointmentDto.barberId,
      date: dateObject, // <--- Aqui vai o Date, não a string
      time: timeObject, // <--- Aqui vai o Date, não a string
      status: 'confirmed', // Alterado para confirmed se não houver fluxo de pagamento
    };

    if (userId) {
      appointmentData.userId = userId;
    } else {
      appointmentData.customerName = createAppointmentDto.name; // Ajuste para bater com o schema (customerName)
      appointmentData.customerPhone = createAppointmentDto.phone; // Ajuste para bater com o schema (customerPhone)
    }

    appointmentData.price = service.price;

    const appointment = await this.prisma.appointment.create({
      data: appointmentData,
      include: {
        service: true,
        barber: true,
        // user: true, // Remova ou ajuste o include se der erro de tipagem no retorno
      },
    });

    // const appointment = await this.prisma.appointment.create({
    //   data: appointmentData,
    //   include: {
    //     service: true,
    //     barber: true,
    //     // user: {
    //     //   select: {
    //     //     id: true,
    //     //     name: true,
    //     //     email: true,
    //     //     phone: true,
    //     //   },
    //     // },
    //   },
    // });

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
