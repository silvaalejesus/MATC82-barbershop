import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.service.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
