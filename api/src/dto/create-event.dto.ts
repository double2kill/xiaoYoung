import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class CreateEventDto {
  @IsMongoId()
  @IsNotEmpty()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsNumber()
  @IsNotEmpty()
  maxParticipants: number;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  @IsOptional()
  safetyNotice?: string;

  @IsString()
  @IsOptional()
  feeInfo?: string;

  @IsDateString()
  @IsNotEmpty()
  deadline: string;

  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;

  @IsEnum(['pending', 'approved', 'rejected'])
  @IsOptional()
  status?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
