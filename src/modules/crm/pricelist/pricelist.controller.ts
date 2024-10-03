import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PricelistService } from './pricelist.service';
import {
  CreatePricelistDto,
  GetCrmPricelistResponseDto,
  GetFormPricelist,
  GetFormPricelistById,
  GetPricelistDto,
  GetPricelistResponseDto,
} from './dto/pricelist.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('crm/pricelist')
export class PricelistController {
  constructor(private readonly pricelistService: PricelistService) {}

  @Get(':projectId')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetCrmPricelistResponseDto,
  })
  async getPricelist(@Param() params: GetPricelistDto) {
    const data = await this.pricelistService.getPricelist(params);
    return {
      message: `Success get list crm pricelist`,
      data,
    };
  }

  @Get('form-create/:projectId')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetPricelistResponseDto,
  })
  async getFormPricelist(@Param() params: GetFormPricelist) {
    const data = await this.pricelistService.getFormPricelist(params);
    return {
      ...data,
    };
  }

  @Get('form-duplicate/:pricelistId')
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetPricelistResponseDto,
  })
  async getFormPricelistById(@Param() params: GetFormPricelistById) {
    const data = await this.pricelistService.getFormPricelistById(params);
    return {
      ...data,
    };
  }

  @Post()
  async createPricelist(@Body() body: CreatePricelistDto) {
    const data = await this.pricelistService.createPricelist(body);
    return {
      message: 'Success create crm pricelist',
      data,
    };
  }
}
