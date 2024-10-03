import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnit, GetUnits, GetUnitsResponseDto } from './dto/unit.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('crm/unit')
export class UnitController {
  constructor(private readonly UnitService: UnitService) {}

  @Get(':project/:cluster')
  @ApiResponse({ status: 200, description: 'Successful response', type: GetUnitsResponseDto })
  async getUnit(@Param() params: GetUnits) {
    const data = await this.UnitService.getUnits(params);
    return {
      message: 'Success get list crm Unit',
      data,
    };
  }

  @Post()
  async createUnit(@Body() body: CreateUnit) {
    const data = await this.UnitService.createUnit(body);
    return {
      message: 'Success create crm unit',
      data,
    };
  }
}
