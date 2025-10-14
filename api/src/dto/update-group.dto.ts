import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  groupType?: string;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: string;
}
