import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

export class CreateClusterDto {
  @ApiProperty({
    example: 'Dahlia',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'abcdefg73hfulof',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    example: 'abcdefg73hfulof',
  })
  @IsString()
  stageId: string;
}
