import { Controller, Get } from '@nestjs/common';
import { PricelistService } from './cluster.service';

@Controller('crm/pricelist')
export class PricelistController {
  constructor(private readonly PricelistService: PricelistService) {}

  @Get()
  async getPricelist() {
    const data = await this.PricelistService.getPricelist();
    return {
      message: 'Success get list crm pricelist',
      data,
    };
  }
}
