import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { DataShowEtat } from '../datashow.schema';

export class CreateDataShowDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  marque: string;

  @IsString()
  @IsNotEmpty()
  modele: string;

  @IsDateString()
  dateAchat: string;

  @IsEnum(DataShowEtat)
  @IsOptional()
  etat?: DataShowEtat;
}
