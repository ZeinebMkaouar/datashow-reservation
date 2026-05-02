import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { DataShowEtat } from '../datashow.schema';

export class UpdateDataShowDto {
  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  marque?: string;

  @IsString()
  @IsOptional()
  modele?: string;

  @IsDateString()
  @IsOptional()
  dateAchat?: string;

  @IsEnum(DataShowEtat)
  @IsOptional()
  etat?: DataShowEtat;
}
