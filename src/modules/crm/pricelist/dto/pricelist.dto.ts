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
import { HasAtLeastOneSellTrue, IsSellValid } from './pricelist.validator';

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

export class GetFormPricelistById {
  @ApiProperty({
    example: 'oavia61e2scc1ig',
  })
  @IsString()
  @IsNotEmpty()
  pricelistId: string;
}

class ListHargaDto {
  // @ApiProperty({ example: 'Tahap 1 - Alamanda (30/40))' })
  // @IsString()
  // name: string;

  @ApiProperty({ example: '{clusterId}-${homeDesignId}' })
  @IsString()
  id: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  sell: boolean;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @IsSellValid({ message: 'If sell is true, price must be greater than 0' })
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

  @ApiProperty({
    example:
      'https://fm.prod.marketa.id/uploads/cms/pricelist/pricelist-gm-sukabumi-juni-2023.jpg',
    required: false,
  })
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
  @HasAtLeastOneSellTrue({
    message: 'At least one object in listHarga must have sell as true.',
  })
  listHarga: ListHargaDto[];
}

export class CreatePricelistDto {
  @ApiProperty({
    example: 'PL TLR Oktober 2024',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '${projectId}',
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

  @ApiProperty({ type: [ListTipeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListTipeDto)
  listTipe: ListTipeDto[];
}
