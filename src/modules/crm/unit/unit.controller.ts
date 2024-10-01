import { Controller, Get, Param } from '@nestjs/common';
import { UnitService } from './unit.service';
import { GetUnits } from './dto/unit.dto';

@Controller('crm/unit')
export class UnitController {
  constructor(private readonly UnitService: UnitService) {}

  @Get(':project/:cluster')
  async getUnit(@Param() params: GetUnits) {
    const data = await this.UnitService.getUnits(params);
    return {
      message: 'Success get list crm Unit',
      data,
    };
  }
}
