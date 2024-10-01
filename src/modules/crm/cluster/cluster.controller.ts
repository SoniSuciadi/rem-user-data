import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { CreateClusterDto } from './dto/cluster.dto';

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

  @Post()
  async createCluster(@Body() body: CreateClusterDto) {
    const data = await this.ClusterService.createCluster(body);
    return {
      message: 'Success create crm cluster',
      data,
    };
  }
}
