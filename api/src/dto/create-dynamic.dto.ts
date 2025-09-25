import { IsString, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateDynamicDto {
  @IsString()
  content: string;

  @IsMongoId()
  authorId: string;

  @IsOptional()
  @IsMongoId()
  groupId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
