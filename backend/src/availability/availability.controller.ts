// src/availability/availability.controller.ts
import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('api/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getAvailability(
    @Query('barberId') barberId: string,
    @Query('date') date: string,
  ) {
    if (!barberId || !date) {
      throw new HttpException(
        'barberId e date são obrigatórios',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Valida formato da data
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new HttpException(
        'Data deve estar no formato YYYY-MM-DD',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const timeSlots = await this.availabilityService.getAvailableSlots(
        barberId,
        date,
      );
      return { timeSlots };
    } catch (error) {
      if (error.message.includes('não encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Erro ao buscar disponibilidade',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
