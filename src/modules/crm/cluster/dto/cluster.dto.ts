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
  @IsNotEmpty()
  name: string;

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
  stageId: string;
}

export class ClusterDto {
  @ApiProperty({ example: 'inoqa6wyyb6nkws' })
  id: string;

  @ApiProperty({ example: 'Arsana Village' })
  name: string;

  @ApiProperty({ example: 'Arsana Village' })
  project: string;

  @ApiProperty({ example: 1 })
  tahap: number | string;
}

export class GetClustersResponseDto {
  @ApiProperty({ example: 'Success get list crm clusters' })
  message: string;

  @ApiProperty({ type: [ClusterDto] })
  data: ClusterDto[];
}
