import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  barberId: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  })
  date: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'Horário deve estar no formato HH:MM',
  })
  time: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

