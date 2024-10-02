import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

export class GetFormPricelist {
  @ApiProperty({
    example: 'fmq3k2mkhmee86d',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}

class ListHargaDto {
  @ApiProperty({ example: 'Tahap 1 (Ruko)' })
  @IsString()
  name: string;

  @ApiProperty({ example: '000000000000008-000000000000020' })
  @IsString()
  id: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  sell: boolean;

  @ApiProperty({ example: 0 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  kprCosts: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  notaryFee: number;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  keterangan: string;
}

class ListTipeDto {
  @ApiProperty({ example: 'Standart' })
  @IsString()
  name: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'NUP' })
  @IsString()
  typeNUP: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  document: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  caraPemesanan: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  catatan: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  @IsOptional()
  dokumenPersyaratanKPR: string;

  @ApiProperty({ type: [ListHargaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListHargaDto)
  listHarga: ListHargaDto[];
}

export class CreatePricelistDto {
  @ApiProperty({
    example: 'PL TLR Oktober 2024',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'hadgj1bs81gsjgs',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    example: 10,
  })
  @IsNumber()
  simulasiPerkiraanBungaKPR: number;

  @ApiProperty({
    example: 5,
  })
  @IsNumber()
  simulasiLamaCicilanKPR: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListTipeDto)
  listTipe: ListTipeDto[];
}
