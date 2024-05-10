import { Controller, Get } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}
  @Get('/stages')
  async getStages() {
    const data = await this.masterService.getStages();
    return {
      message: 'Success get list stage',
      data,
    };
  }
  @Get('/clusters')
  async getClusters() {
    const data = await this.masterService.getClusters();
    return {
      message: 'Success get list cluster',
      data,
    };
  }
  @Get('/bloks')
  async getBloks() {
    const data = await this.masterService.getBloks();
    return {
      message: 'Success get list blok',
      data,
    };
  }
  @Get('/units')
  async getUnits() {
    const data = await this.masterService.getUnits();
    return {
      message: 'Success get list unit',
      data,
    };
  }
  @Get('/facilities')
  async getFacilities() {
    const data = await this.masterService.getFacilities();
    return {
      message: 'Success get list facilities',
      data,
    };
  }
  @Get('/infrastructure')
  async getInfrastructure() {
    const data = await this.masterService.getInfrastructure();
    return {
      message: 'Success get list infrastructure',
      data,
    };
  }
}
