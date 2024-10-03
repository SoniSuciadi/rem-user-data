import { Body, Controller, Get, Post } from '@nestjs/common';
import { TahapService } from './tahap.service';

@Controller('crm/tahap')
export class TahapController {
  constructor(private readonly TahapService: TahapService) {}

  @Get()
  async findAll() {
    const data = await this.TahapService.findAll();
    return {
      message: `Success get list crm tahap`,
      data,
    };
  }

  @Get(':projectId')
  async findByProjectId() {
    const data = await this.TahapService.findByProjectId();
    return {
      message: `Success get list crm tahap`,
      data,
    };
  }

  @Post()
  async create() {
    const data = await this.TahapService.create();
    return {
      message: 'Success create crm tahap',
      data,
    };
  }
}
