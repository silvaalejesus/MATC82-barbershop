import {
  IsString,
  IsEmail,
  IsArray,
  IsEnum,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { BarberStatus } from './create-barber.dto';

export class UpdateBarberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @IsOptional()
  @IsEnum(BarberStatus)
  status?: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}

