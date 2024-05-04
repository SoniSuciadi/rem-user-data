import { Controller, Get, Param } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}
  @Get('/:projectId/stages')
  async getStages(@Param('projectId') projectId: string) {
    const data = await this.masterService.getStages(projectId);
    return {
      message: 'Success get list stage',
      data,
    };
  }
  @Get('/:projectId/clusters')
  async getClusters(@Param('projectId') projectId: string) {
    const data = await this.masterService.getClusters(projectId);
    return {
      message: 'Success get list cluster',
      data,
    };
  }
  @Get('/:projectId/bloks')
  async getBloks(@Param('projectId') projectId: string) {
    const data = await this.masterService.getBloks(projectId);
    return {
      message: 'Success get list blok',
      data,
    };
  }
  @Get('/:projectId/units')
  async getUnits(@Param('projectId') projectId: string) {
    const data = await this.masterService.getUnits(projectId);
    return {
      message: 'Success get list unit',
      data,
    };
  }
  @Get('/:projectId/facilities')
  async getFacilities(@Param('projectId') projectId: string) {
    const data = await this.masterService.getFacilities(projectId);
    return {
      message: 'Success get list blok',
      data,
    };
  }
  @Get('/:projectId/infrastructure')
  async getInfrastructure(@Param('projectId') projectId: string) {
    const data = await this.masterService.getInfrastructure(projectId);
    return {
      message: 'Success get list blok',
      data,
    };
  }
}
