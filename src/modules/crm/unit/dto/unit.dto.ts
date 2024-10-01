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

export class GetUnits {
  @ApiProperty({
    example: 'The Leaf Residence',
  })
  @IsString()
  project: string;

  @ApiProperty({
    example: 'Alamanda',
  })
  @IsString()
  cluster: string;
}
