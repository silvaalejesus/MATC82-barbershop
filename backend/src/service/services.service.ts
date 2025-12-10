import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateServiceDto } from './dto/create.service.dto';
import { UpdateServiceDto } from './dto/update.service.dto';

@Injectable()
export class ServicesService {
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
   * Lista todos os serviços
   * @param activeOnly - Se true, retorna apenas serviços ativos
   */
  async findAll(activeOnly = true) {
    const where = activeOnly ? { active: true } : {};

    return this.prisma.service.findMany({
      where,
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Busca um serviço por ID
   */
  async findById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    });

    return service;
  }

  /**
   * Cria um novo serviço
   */
  async create(createServiceDto: CreateServiceDto) {
    const service = await this.prisma.service.create({
      data: {
        name: createServiceDto.name,
        price: createServiceDto.price,
        durationMinutes: createServiceDto.durationMinutes,
        description: createServiceDto.description || null,
        imageUrl: createServiceDto.imageUrl || null,
        active: createServiceDto.active ?? true,
      },
    });

    return service;
  }

  /**
   * Atualiza um serviço existente
   */
  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      return null;
    }

    const updateData = Object.fromEntries(
      Object.entries(updateServiceDto).filter(
        ([_, value]) => value !== undefined,
      ),
    );

    return this.prisma.service.update({
      where: { id },
      data: updateData, // Prisma infere automaticamente o tipo certo!
    });
  }

  /**
   * Remove um serviço (soft delete - apenas desativa)
   * Isso evita problemas com agendamentos existentes
   */
  async delete(id: string) {
    // Verifica se o serviço existe
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return null;
    }

    // Soft delete: apenas desativa o serviço
    await this.prisma.service.update({
      where: { id },
      data: { active: false },
    });

    return true;
  }

  /**
   * Remove permanentemente um serviço (hard delete)
   * Use com cuidado! Pode quebrar referências de agendamentos
   */
  async hardDelete(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    });

    if (!service) {
      return null;
    }

    // Verifica se há agendamentos associados
    if (service._count.appointments > 0) {
      throw new Error(
        `Não é possível deletar o serviço. Existem ${service._count.appointments} agendamentos associados.`,
      );
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return true;
  }
}
