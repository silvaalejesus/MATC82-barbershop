import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

class ScheduleItemDto {
  @IsInt()
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Formato de hora inválido (HH:MM)' })
  startTime: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Formato de hora inválido (HH:MM)' })
  endTime: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  breakStart?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  breakEnd?: string;
}

export class UpdateScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedules: ScheduleItemDto[];
}
