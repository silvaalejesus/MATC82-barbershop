import {
  IsString,
  IsEmail,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

export enum BarberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateBarberDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @IsNotEmpty()
  @IsEnum(BarberStatus)
  status: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;
}

