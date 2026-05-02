import { IsString, IsNotEmpty } from 'class-validator';

export class ResolveClaimDto {
  @IsString()
  @IsNotEmpty()
  adminResponse: string;
}
