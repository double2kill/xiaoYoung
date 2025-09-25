import { IsMongoId, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class JoinEventDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['pending', 'approved', 'rejected'])
  @IsOptional()
  status?: string;
}
