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

export class CreateUnit {
  @ApiProperty({
    example: 'abcdefg73hfulof',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 'abcdefg73hfulof',
  })
  @IsString()
  @IsNotEmpty()
  clusterId: string;

  @ApiProperty({
    example: 'abcdefg73hfulof',
  })
  @IsString()
  @IsNotEmpty()
  homeDesignId: string;

  @ApiProperty({
    example: 'A',
  })
  @IsString()
  @IsNotEmpty()
  block: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  homeNumber: string;

  @ApiProperty({
    example: 'Siap Jual',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}
