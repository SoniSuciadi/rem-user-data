import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import {
  CreatePricelistDto,
  GetFormPricelist,
  GetPricelistDto,
} from './dto/pricelist.dto';

@Controller('crm/pricelist')
export class PricelistController {
  constructor(private readonly PricelistService: PricelistService) {}

  @Get(':projectId')
  async getPricelist(@Param() params: GetPricelistDto) {
    const data = await this.PricelistService.getPricelist(params);
    return {
      message: `Success get list crm pricelist`,
      data,
    };
  }

  @Get('form-create/:projectId')
  async getFormPricelist(@Param() params: GetFormPricelist) {
    const data = await this.PricelistService.getFormPricelist(params);
    return {
      ...data,
    };
  }

  @Post()
  async createPricelist(@Body() body: CreatePricelistDto) {
    const data = await this.PricelistService.createPricelist(body);
    return {
      message: 'Success create crm pricelist',
      data,
    };
  }
}
