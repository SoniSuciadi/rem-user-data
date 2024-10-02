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
  @IsString()
  name: string;

  @IsString()
  id: string;

  @IsBoolean()
  sell: boolean;

  @IsNumber()
  price: number;

  @IsNumber()
  kprCosts: number;

  @IsNumber()
  notaryFee: number;

  @IsString()
  @IsOptional()
  keterangan: string;
}

class ListTipeDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  typeNUP: string;

  @IsString()
  @IsOptional()
  document: string;

  @IsString()
  @IsOptional()
  caraPemesanan: string;

  @IsString()
  @IsOptional()
  catatan: string;

  @IsString()
  @IsOptional()
  dokumenPersyaratanKPR: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListHargaDto)
  listHarga: ListHargaDto[];
}

export class CreatePricelistDto {
  @IsString()
  name: string;

  @IsString()
  projectId: string;

  @IsNumber()
  simulasiPerkiraanBungaKPR: number;

  @IsNumber()
  simulasiLamaCicilanKPR: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListTipeDto)
  listTipe: ListTipeDto[];
}
