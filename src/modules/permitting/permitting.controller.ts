import { Controller, Get } from '@nestjs/common';
import { PermittingService } from './permitting.service';

@Controller('permitting')
export class PermittingController {
  constructor(private readonly permittingService: PermittingService) {}

  @Get('/submission-rab')
  async getSubmission() {
    const data = await this.permittingService.getSubmission();
    return {
      message: 'Success get list submission',
      data,
    };
  }
  @Get('/submission-document')
  async getDocumentSubmission() {
    const data = await this.permittingService.getDocumentSubmission();
    return {
      message: 'Success get document submission',
      data,
    };
  }
  @Get('/consultant-bill-payment')
  async getConsultantBillPayment() {
    const data = await this.permittingService.getConsultantBillPayment();
    return {
      message: 'Success get consultant bill payment',
      data,
    };
  }
  @Get('/permitting-bill-payment')
  async getpermmitBillPayment() {
    const data = await this.permittingService.getpermmitBillPayment();
    return {
      message: 'Success get permitted Bill payment',
      data,
    };
  }
}
