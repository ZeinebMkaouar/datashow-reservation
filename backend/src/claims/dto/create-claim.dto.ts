import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClaimDto {
  @IsString()
  @IsNotEmpty()
  datashowId: string;

  @IsString()
  @IsNotEmpty()
  issueType: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
