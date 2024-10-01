import { Controller, Get } from '@nestjs/common';
import { HomeDesignService } from './homeDesign.service';

@Controller('crm/home-design')
export class HomeDesignController {
  constructor(private readonly HomeDesignService: HomeDesignService) {}

  @Get()
  async gethomeDesign() {
    const data = await this.HomeDesignService.gethomeDesign();
    return {
      message: 'Success get list crm home design',
      data,
    };
  }
}
