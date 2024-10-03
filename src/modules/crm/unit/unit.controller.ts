import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUnit, GetUnits, GetUnitsResponseDto } from './dto/unit.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UnitService } from './unit.service';

@Controller('crm/unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Get(':project/:cluster')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetUnitsResponseDto,
  })
  async getUnit(@Param() params: GetUnits) {
    const data = await this.unitService.getUnits(params);
    return {
      message: 'Success get list crm Unit',
      data,
    };
  }

  @Post()
  async createUnit(@Body() body: CreateUnit) {
    const data = await this.unitService.createUnit(body);
    return {
      message: 'Success create crm unit',
      data,
    };
  }
}
