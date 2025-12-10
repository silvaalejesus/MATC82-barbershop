import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentsService } from './appointment.service';

@Controller('api/appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAllAppointments(@Query('date') date?: string) {
    try {
      const appointments = await this.appointmentsService.findAll(date);
      return appointments;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createAppointment(
    @Query('userId') userId: string | undefined,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    // Valida se tem userId ou name/phone
    if (!userId && (!createAppointmentDto.name || !createAppointmentDto.phone)) {
      throw new HttpException(
        'Nome e telefone são obrigatórios para usuários não autenticados',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const appointment = await this.appointmentsService.create(
        createAppointmentDto,
        userId,
      );
      return appointment;
    } catch (error) {
      if (error.message.includes('Horário já está reservado')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Erro ao criar agendamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('me')
  async getMyAppointments(
    @Query('userId') userId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
  ) {
    if (!userId) {
      throw new HttpException('userId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    try {
      const appointments = await this.appointmentsService.findByUser(
        userId,
        status,
        limit ? parseInt(limit) : undefined,
      );
      return appointments;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar agendamentos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/cancel')
  async cancelAppointment(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    if (!userId) {
      throw new HttpException('userId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    try {
      const appointment = await this.appointmentsService.cancel(id, userId);
      
      if (!appointment) {
        throw new HttpException(
          'Agendamento não encontrado ou você não tem permissão',
          HttpStatus.NOT_FOUND,
        );
      }

      return appointment;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Erro ao cancelar agendamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
