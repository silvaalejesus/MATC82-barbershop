import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateScheduleDto } from './dto/update-admin.dto';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Middleware para verificar se o usuário é admin
   */
  private async verifyAdmin(adminId: string) {
    if (!adminId) {
      throw new HttpException('adminId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = await this.adminService.verifyAdmin(adminId);
    if (!isAdmin) {
      throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
    }
  }

  /**
   * GET /api/admin/dashboard
   * Retorna todos os dados agregados do dashboard
   */
  @Get('dashboard')
  async getDashboard(@Query('adminId') adminId: string) {
    await this.verifyAdmin(adminId);

    try {
      const dashboardData = await this.adminService.getDashboardData();
      return dashboardData;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar dados do dashboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/admin/schedules
   * Lista as agendas de todos os barbeiros
   */
  @Get('schedules')
  async getSchedules(@Query('adminId') adminId: string) {
    await this.verifyAdmin(adminId);

    try {
      const schedules = await this.adminService.getAllSchedules();
      return schedules;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/admin/schedules/:barberId
   * Atualiza a agenda completa de um barbeiro
   */
  @Put('schedules/:barberId')
  async updateSchedule(
    @Param('barberId') barberId: string,
    @Query('adminId') adminId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    await this.verifyAdmin(adminId);

    try {
      const updatedSchedule = await this.adminService.updateBarberSchedule(
        barberId,
        updateScheduleDto.schedule,
      );

      if (!updatedSchedule) {
        throw new HttpException(
          'Barbeiro não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      return updatedSchedule;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Erro ao atualizar agenda',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/admin/clients
   * Lista todos os clientes com suas estatísticas
   */
  @Get('clients')
  async getClients(
    @Query('adminId') adminId: string,
    @Query('search') search?: string,
  ) {
    await this.verifyAdmin(adminId);

    try {
      const clients = await this.adminService.getAllClients(search);
      return clients;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar clientes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/admin/appointments
   * Lista todos os agendamentos com filtros opcionais
   */
  @Get('appointments')
  async getAppointments(
    @Query('adminId') adminId: string,
    @Query('status') status?: string,
  ) {
    await this.verifyAdmin(adminId);

    try {
      const appointments = await this.adminService.getAllAppointments(status);
      return appointments;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

