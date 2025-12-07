import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices() {
    const services = await this.servicesService.findAll();

    if (!services) {
      throw new InternalServerErrorException();
    }

    return services;
  }
}
