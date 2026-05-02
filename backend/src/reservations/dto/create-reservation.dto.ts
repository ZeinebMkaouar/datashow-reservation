import { IsDateString, IsEnum, IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { Seance, ReservationType } from '../reservation.schema';

export class CreateReservationDto {
  @IsDateString()
  date: string;

  @IsEnum(Seance)
  seance: Seance;

  @IsString()
  @IsNotEmpty()
  salle: string;

  @IsMongoId()
  datashow: string;

  @IsEnum(ReservationType)
  @IsOptional()
  type?: ReservationType;
}
