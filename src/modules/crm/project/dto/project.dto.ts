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

export class CreateProjectDto {
  @ApiProperty({
    example: 'The Leaf Residence',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'JL Sudirman etc...',
  })
  @IsString()
  officeAddress: string;

  @ApiProperty({
    example: 'PT Indonesia Merdeka',
  })
  @IsString()
  ptName: string;

  @ApiProperty({
    example: 'Jalan Sudirman etc...',
  })
  @IsString()
  projectAddress: string;

  @ApiProperty({
    example: 'John Jackson',
  })
  @IsString()
  accountNameBprs: string;

  @ApiProperty({
    example: '312341234',
  })
  @IsString()
  accountNumberBprs: string;

  @ApiProperty({
    example: 'Bank Central Indonesia (BCA)',
  })
  @IsString()
  bankNameBprs: string;

  @ApiProperty({
    example: 'John Jackson',
  })
  @IsString()
  accountNameOther: string;

  @ApiProperty({
    example: '312341234',
  })
  @IsString()
  accountNumberOther: string;

  @ApiProperty({
    example: 'Bank Central Indonesia (BCA)',
  })
  @IsString()
  bankNameOther: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  isExternal: boolean;

  @ApiProperty({
    example: 90,
  })
  @IsNumber()
  retentionPeriod: number;
}
