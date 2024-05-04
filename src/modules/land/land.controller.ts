import { Controller, Get, Param } from '@nestjs/common';
import { LandService } from './land.service';

@Controller('land')
export class LandController {
  constructor(private readonly landService: LandService) {}
  @Get('/:projectId/land-list')
  async getLandList(@Param('projectId') projectId: string) {
    const data = await this.landService.getLandList(projectId);
    return {
      message: 'Success get list land',
      data,
    };
  }
  @Get('/:projectId/stakeholder')
  async getStakeholder(@Param('projectId') projectId: string) {
    const data = await this.landService.getStakeholder(projectId);
    return {
      message: 'Success get list stakeholder',
      data,
    };
  }
}
