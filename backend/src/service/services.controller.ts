import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create.service.dto';
import { UpdateServiceDto } from './dto/update.service.dto';

@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices(@Query('active') active?: string) {
    try {
      const showOnlyActive = active === 'true' || active === undefined;
      const services = await this.servicesService.findAll(showOnlyActive);
      return services;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar serviços',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    try {
      const service = await this.servicesService.findById(id);

      if (!service) {
        throw new HttpException('Serviço não encontrado', HttpStatus.NOT_FOUND);
      }

      return service;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Erro ao buscar serviço',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createService(
    @Query('adminId') adminId: string,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    if (!adminId) {
      throw new HttpException('adminId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = await this.servicesService.verifyAdmin(adminId);
    if (!isAdmin) {
      throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
    }

    try {
      const service = await this.servicesService.create(createServiceDto);
      return service;
    } catch (error) {
      throw new HttpException(
        'Erro ao criar serviço',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateService(
    @Param('id') id: string,
    @Query('adminId') adminId: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    if (!adminId) {
      throw new HttpException('adminId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = await this.servicesService.verifyAdmin(adminId);
    if (!isAdmin) {
      throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
    }

    try {
      const service = await this.servicesService.update(id, updateServiceDto);

      if (!service) {
        throw new HttpException('Serviço não encontrado', HttpStatus.NOT_FOUND);
      }

      return service;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Erro ao atualizar serviço',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteService(
    @Param('id') id: string,
    @Query('adminId') adminId: string,
  ) {
    if (!adminId) {
      throw new HttpException('adminId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = await this.servicesService.verifyAdmin(adminId);
    if (!isAdmin) {
      throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
    }

    try {
      const deleted = await this.servicesService.delete(id);

      if (!deleted) {
        throw new HttpException('Serviço não encontrado', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Erro ao deletar serviço',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
