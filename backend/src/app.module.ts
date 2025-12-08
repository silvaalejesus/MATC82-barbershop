import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { BarberModule } from './barber/barber.module';
import { AppointmentModule } from './appointment/appointment.module';
import { AvailabilityModule } from './availability/availability.module';
import { ServicesModule } from './service/services.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ServicesModule,
    // AdminModule,
    BarberModule,
    AppointmentModule,
    AvailabilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
