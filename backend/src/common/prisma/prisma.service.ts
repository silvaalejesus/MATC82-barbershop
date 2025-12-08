import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }
}
