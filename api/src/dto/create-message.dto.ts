import {
  IsString,
  IsOptional,
  IsArray,
  IsMongoId,
  IsBoolean,
} from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  senderId: string;

  @IsMongoId()
  receiverId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
