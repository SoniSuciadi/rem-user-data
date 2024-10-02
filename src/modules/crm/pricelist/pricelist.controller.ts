import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import { GetPricelistDto } from './dto/pricelist.dto';

@Controller('crm/pricelist')
export class PricelistController {
  constructor(private readonly PricelistService: PricelistService) {}

  @Get(':projectId')
  async getPricelist(@Param() params: GetPricelistDto) {
    const data = await this.PricelistService.getPricelist(params);
    return {
      message: 'Success get list crm pricelist',
      data,
    };
  }
}
