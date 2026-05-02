import { IsString, IsNotEmpty, IsDateString, IsMongoId } from 'class-validator';

export class CreateRepairDto {
  @IsMongoId()
  datashow: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  technician: string;
}
