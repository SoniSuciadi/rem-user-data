import { Controller, Get } from '@nestjs/common';
import { UnitService } from './unit.service';

@Controller('crm/unit')
export class UnitController {
  constructor(private readonly UnitService: UnitService) {}

  @Get()
  async getUnit() {
    const data = await this.UnitService.getUnits();
    return {
      message: 'Success get list crm Unit',
      data,
    };
  }
}
