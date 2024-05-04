import { Controller, Get, Param } from '@nestjs/common';
import { MasterService } from './master.service';

@Controller('master')
export class MasterController {
  constructor(private readonly masterService: MasterService) {}
  @Get('/:projectId/stage')
  async getStage(@Param('projectId') projectId: string) {
    const data = await this.masterService.getStage(projectId);
    return {
      message: 'Success get list stage',
      data,
    };
  }
}
