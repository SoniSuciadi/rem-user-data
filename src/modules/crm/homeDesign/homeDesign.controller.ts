import { Body, Controller, Get, Post } from '@nestjs/common';
import { HomeDesignService } from './homeDesign.service';
import { CreateHomeDesignDto, GetHomeDesignResponseDto } from './dto/homeDesign.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('crm/home-design')
export class HomeDesignController {
  constructor(private readonly HomeDesignService: HomeDesignService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Success', type: GetHomeDesignResponseDto })
  async gethomeDesign() {
    const data = await this.HomeDesignService.gethomeDesign();
    return {
      message: 'Success get list crm home design',
      data,
    };
  }

  @Post()
  async createHomeDesign(@Body() body: CreateHomeDesignDto) {
    const data = await this.HomeDesignService.createHomeDesign(body);
    return {
      message: 'Success create crm home design',
      data,
    };
  }
}
