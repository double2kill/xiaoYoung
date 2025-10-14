import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  groupType: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string;
}
