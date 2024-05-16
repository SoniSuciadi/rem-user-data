import { Controller, Get } from '@nestjs/common';
import { QcService } from './qc.service';

@Controller('qc')
export class QcController {
  constructor(private readonly qcService: QcService) {}
  @Get('/')
  async getQcRecap() {
    const data = await this.qcService.getQcRecap();
    return {
      message: 'Success Get Qc Reacap',
      data,
    };
  }
}
