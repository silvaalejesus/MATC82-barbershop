import { Injectable, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { throwError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password_hash: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      if (!user) {
        throw new NotFoundException('User com esse ID não encontrado');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...(updateUserDto.name && { name: updateUserDto.name }),
        ...(updateUserDto.email && { email: updateUserDto.email }),
        ...(updateUserDto.phone && { phone: updateUserDto.phone }),
      },
      omit: {
        password_hash: true,
      },
    });

    return updatedUser;
  }
}
