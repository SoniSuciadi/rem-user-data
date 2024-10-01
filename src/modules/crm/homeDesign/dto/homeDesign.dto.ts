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

export class CreateHomeDesignDto {
  @ApiProperty({
    example: 'TLR (40/70)',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 40,
  })
  @IsNumber()
  buildingArea: number;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  fieldWidth: number;

  @ApiProperty({
    example: 7,
  })
  @IsNumber()
  fieldLength: number;

  @ApiProperty({
    example: 'Batu Bata Plester',
  })
  @IsString()
  bakKM: string;

  @ApiProperty({
    example: 'Kusen Aluminium',
  })
  @IsString()
  doorWindow: string;

  @ApiProperty({
    example: 'Cat Dinding',
  })
  @IsString()
  finishingWall: string;

  @ApiProperty({
    example: '40cm x 40cm',
  })
  @IsString()
  floor: string;

  @ApiProperty({
    example: '1',
  })
  @IsString()
  floorNumber: string;

  @ApiProperty({
    example: 'Batu Kali Menerus',
  })
  @IsString()
  foundation: string;

  @ApiProperty({
    example: 'PVC',
  })
  @IsString()
  kusenKM: string;

  @ApiProperty({
    example: '2200',
  })
  @IsString()
  electricity: string;

  @ApiProperty({
    example: 'Gypsum',
  })
  @IsString()
  plafon: string;

  @ApiProperty({
    example: 'Paving',
  })
  @IsString()
  road: string;

  @ApiProperty({
    example: '6.5',
  })
  @IsString()
  roadWidth: string;

  @ApiProperty({
    example: 'Rangka Atap Galvalum',
  })
  @IsString()
  roof: string;

  @ApiProperty({
    example: 'Closet duduk',
  })
  @IsString()
  sanitize: string;

  @ApiProperty({
    example: 'CCTV 24 jam',
  })
  @IsString()
  securitySystem: string;

  @ApiProperty({
    example: 'Beton Bertulang',
  })
  @IsString()
  structure: string;

  @ApiProperty({
    example: 'Bata Ringan',
  })
  @IsString()
  wall: string;

  @ApiProperty({
    example: 'Hebel',
  })
  @IsString()
  wallType: string;

  @ApiProperty({
    example: 'Sumur Bor / PAM',
  })
  @IsString()
  waterSource: string;

  @ApiProperty({
    example: 2,
  })
  @IsNumber()
  bedroom: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  carpot: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  kitchen: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  livingRoom: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  toilet: number;

  @ApiProperty({
    example: [
      'https://fm.prod.marketa.id/uploads/cms/desain-rumah/screenshot-2024-09-20-104322.png',
    ],
  })
  @IsArray()
  @IsString({ each: true, message: 'Each picture must be a string' })
  pictures: string[];

  @ApiProperty({
    example:
      'https://fm.prod.marketa.id/uploads/cms/desain-rumah/screenshot-2024-09-20-104322.png',
  })
  @IsString()
  mainPictureUrl: string;
}
