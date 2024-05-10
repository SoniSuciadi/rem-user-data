import { Controller, Get } from '@nestjs/common';
import { LandService } from './land.service';

@Controller('land')
export class LandController {
  constructor(private readonly landService: LandService) {}
  @Get('/land-list')
  async getLandList() {
    const data = await this.landService.getLandList();
    return {
      message: 'Success get list land',
      data,
    };
  }
  @Get('/stakeholder')
  async getStakeholder() {
    const data = await this.landService.getStakeholder();
    return {
      message: 'Success get list stakeholder',
      data,
    };
  }
  @Get('/land-payment')
  async getLandPayment() {
    const data = await this.landService.getLandPayment();
    return {
      message: 'Success get land payment list',
      data,
    };
  }
  @Get('/land-bill')
  async getLandBill() {
    const data = await this.landService.getLandBill();
    return {
      message: 'Success get land bill',
      data,
    };
  }
}
