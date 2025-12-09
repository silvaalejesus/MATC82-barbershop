import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../prisma/generated/client';

@Injectable()
export class PrismaService extends PrismaClient {
  // Ensure PrismaClient is constructed with a non-empty options object.
  // The generated client requires an options parameter at runtime; providing
  // a minimal valid option (log) satisfies that requirement.
  constructor() {
    // Pass a small, valid options object. Adjust logging or other options
    // here if needed for your environment.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - runtime accepts this shape from the generated client
    super({ log: ['error'] });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
