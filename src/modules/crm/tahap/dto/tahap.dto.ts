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
  Min,
} from 'class-validator';

export class GetTahapDto {
  @ApiProperty({
    example: 'abcdefg73hfulof',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class CreateTahapDto {
  @ApiProperty({
    example: 'abcdefg73hfulof',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  stage: number;
}

export class TahapDto {
  @ApiProperty({ example: 'b460r5djfl47x8v' })
  id: string;

  @ApiProperty({ example: 1 })
  name: number;

  @ApiProperty({ example: 'Arsana Village' })
  proyek: string;
}

export class GetTahapResponseDto {
  @ApiProperty({ example: 'Success get list crm tahap' })
  message: string;

  @ApiProperty({ type: [TahapDto] })
  data: TahapDto[];
}
