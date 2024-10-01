import { Controller, Get } from '@nestjs/common';
import { ClusterService } from './cluster.service';

@Controller('crm/cluster')
export class ClusterController {
  constructor(private readonly ClusterService: ClusterService) {}

  @Get()
  async getClusters() {
    const data = await this.ClusterService.getClusters();
    return {
      message: 'Success get list crm clusters',
      data,
    };
  }
}
