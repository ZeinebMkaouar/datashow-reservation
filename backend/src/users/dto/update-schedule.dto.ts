import { IsObject, IsOptional } from 'class-validator';

export class UpdateScheduleDto {
  @IsObject()
  @IsOptional()
  monday?: Record<string, string>;

  @IsObject()
  @IsOptional()
  tuesday?: Record<string, string>;

  @IsObject()
  @IsOptional()
  wednesday?: Record<string, string>;

  @IsObject()
  @IsOptional()
  thursday?: Record<string, string>;

  @IsObject()
  @IsOptional()
  friday?: Record<string, string>;

  @IsObject()
  @IsOptional()
  saturday?: Record<string, string>;
}
