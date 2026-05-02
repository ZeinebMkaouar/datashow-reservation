import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  building: string;

  @IsBoolean()
  @IsOptional()
  hasEquipment?: boolean;
}
