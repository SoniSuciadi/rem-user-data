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

export class GetPricelistDto {
  @ApiProperty({
    example: 'fmq3k2mkhmee86d',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class CreatePricelistDto {
  @ApiProperty({
    example: 'fmq3k2mkhmee86d',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 'Pricelist Oktober',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
