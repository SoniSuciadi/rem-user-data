import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'The Leaf Residence',
  })
  @IsNotEmpty()
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
    example: false,
  })
  @IsBoolean()
  isExternal: boolean;

  @ApiProperty({
    example: 90,
  })
  @IsNumber()
  retentionPeriod: number;

  @ApiProperty({
    example: '082174629334',
  })
  @IsString()
  adminContact: string;
}

export class ProjectDto {
  @ApiProperty({ example: 'AV' })
  abbreviation: string;

  @ApiProperty({ example: '000000000000005' })
  id: string;

  @ApiProperty({ example: false })
  isExternal: boolean;

  @ApiProperty({ example: 'Arsana Village' })
  name: string;
}

export class GetProjectsResponseDto {
  @ApiProperty({ example: 'Success get list crm projects' })
  message: string;

  @ApiProperty({ type: [ProjectDto] })
  data: ProjectDto[];
}
