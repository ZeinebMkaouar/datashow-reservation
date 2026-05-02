import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  building?: string;

  @IsBoolean()
  @IsOptional()
  hasEquipment?: boolean;
}
