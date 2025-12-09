// src/barbers/barbers.controller.ts
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
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBarberDto } from './dto/create-barber.dto';
import { UpdateBarberDto } from './dto/update-barber.dto';
import { BarbersService } from './barber.service';

@Controller('api/barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get()
  async getAllBarbers() {
    const barbers = await this.barbersService.findAll();

    if (!barbers) {
      throw new InternalServerErrorException();
    }

    return barbers;
  }

  @Post()
  async createBarber(
    @Query('adminId') adminId: string,
    @Body() createBarberDto: CreateBarberDto,
  ) {
    if (!adminId) {
      throw new HttpException('adminId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = await this.barbersService.verifyAdmin(adminId);
    if (!isAdmin) {
      throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
    }

    try {
      const barber = await this.barbersService.create(createBarberDto);
      return barber;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Erro ao criar barbeiro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateBarber(
    @Param('id') id: string,
    @Query('adminId') adminId: string,
    @Body() updateBarberDto: UpdateBarberDto,
  ) {
    if (!adminId) {
      throw new HttpException('adminId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = await this.barbersService.verifyAdmin(adminId);
    if (!isAdmin) {
      throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
    }

    try {
      const barber = await this.barbersService.update(id, updateBarberDto);
      if (!barber) {
        throw new HttpException(
          'Barbeiro não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      return barber;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Erro ao atualizar barbeiro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBarber(
    @Param('id') id: string,
    @Query('adminId') adminId: string,
  ) {
    if (!adminId) {
      throw new HttpException('adminId é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const isAdmin = await this.barbersService.verifyAdmin(adminId);
    if (!isAdmin) {
      throw new HttpException('Acesso negado', HttpStatus.FORBIDDEN);
    }

    try {
      const deleted = await this.barbersService.delete(id);
      if (!deleted) {
        throw new HttpException(
          'Barbeiro não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      }
      throw new HttpException(
        'Erro ao deletar barbeiro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

