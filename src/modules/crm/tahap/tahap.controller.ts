import { Body, Controller, Get, Post } from '@nestjs/common';
import { TahapService } from './tahap.service';

@Controller('crm/tahap')
export class TahapController {
  constructor(private readonly TahapService: TahapService) {}

  @Get()
  async getTahap() {}
}
