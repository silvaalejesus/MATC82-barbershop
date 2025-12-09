import { Module } from '@nestjs/common';
import { BarbersService } from './barber.service';
import { BarbersController } from './barber.controller';

@Module({
  controllers: [BarbersController],
  providers: [BarbersService],
})
export class BarberModule {}

