import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './user.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  @Put('me')
  async updateProfile(
    @Query('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    const updatedUser = await this.usersService.update(userId, updateUserDto);

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return updatedUser;
  }
}
