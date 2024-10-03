import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { TahapService } from './tahap.service';
import {
  CreateTahapDto,
  GetTahapDto,
  GetTahapResponseDto,
} from './dto/tahap.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('crm/tahap')
export class TahapController {
  constructor(private readonly tahapService: TahapService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetTahapResponseDto,
  })
  async findAll() {
    const data = await this.tahapService.findAll();
    return {
      message: `Success get list crm tahap`,
      data,
    };
  }

  @Get(':projectId')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetTahapResponseDto,
  })
  async findByProjectId(@Param() params: GetTahapDto) {
    const data = await this.tahapService.findByProjectId(params);
    return {
      message: `Success get list crm tahap`,
      data,
    };
  }

  @Post()
  async create(@Body() body: CreateTahapDto) {
    const data = await this.tahapService.create(body);
    return {
      message: 'Success create crm tahap',
      data,
    };
  }
}
