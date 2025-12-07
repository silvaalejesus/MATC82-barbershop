import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointment.service';
import { AppointmentsController } from './appointment.controller';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentModule {}
