import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class BarbersService {
  constructor(private prisma: PrismaService) {}

  async updateSchedule(barberId: string, updateScheduleDto: UpdateScheduleDto) {
    const barber = await this.prisma.barber.findUnique({
      where: { id: barberId },
    });
    if (!barber) throw new Error('Barbeiro não encontrado');

    await this.prisma.$transaction(
      updateScheduleDto.schedules.map((item) => {
        const toDate = (timeStr?: string) =>
          timeStr ? new Date(`1970-01-01T${timeStr}:00Z`) : null;

        return this.prisma.barberSchedule.upsert({
          where: {
            barberId_dayOfWeek: {
              barberId: barberId,
              dayOfWeek: item.dayOfWeek,
            },
          },
          update: {
            isAvailable: item.isAvailable,
            startTime: toDate(item.startTime)!,
            endTime: toDate(item.endTime)!,
            breakStart: toDate(item.breakStart),
            breakEnd: toDate(item.breakEnd),
          },
          create: {
            barberId: barberId,
            dayOfWeek: item.dayOfWeek,
            isAvailable: item.isAvailable,
            startTime: toDate(item.startTime)!,
            endTime: toDate(item.endTime)!,
            breakStart: toDate(item.breakStart),
            breakEnd: toDate(item.breakEnd),
          },
        });
      }),
    );

    return { message: 'Horários atualizados com sucesso' };
  }

  async findAll() {
    return this.prisma.barber.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(createBarberDto: CreateBarberDto) {
    const barber = await this.prisma.barber.create({
      data: {
        name: createBarberDto.name,
        email: createBarberDto.email,
        phone: createBarberDto.phone,
        specialties: createBarberDto.specialties,
      },
    });

    return barber;
  }

  async update(id: string, updateBarberDto: UpdateBarberDto) {
    const barber = await this.prisma.barber.findUnique({
      where: { id },
    });

    if (!barber) {
      return null;
    }

    const updatedBarber = await this.prisma.barber.update({
      where: { id },
      data: {
        ...(updateBarberDto.name && { name: updateBarberDto.name }),
        ...(updateBarberDto.email && { email: updateBarberDto.email }),
        ...(updateBarberDto.phone && { phone: updateBarberDto.phone }),
        ...(updateBarberDto.specialties && {
          specialties: updateBarberDto.specialties,
        }),
      },
    });

    return updatedBarber;
  }

  async delete(id: string) {
    const barber = await this.prisma.barber.findUnique({
      where: { id },
    });

    if (!barber) {
      return null;
    }

    await this.prisma.barber.delete({
      where: { id },
    });

    return true;
  }

  async verifyAdmin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    return user?.role === 'admin';
  }
}
