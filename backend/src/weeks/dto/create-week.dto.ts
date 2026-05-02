import { IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateWeekDto {
  @IsDateString()
  weekStart: string; // Must be a Monday (YYYY-MM-DD)

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}
