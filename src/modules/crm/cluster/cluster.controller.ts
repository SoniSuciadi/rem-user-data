import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { CreateClusterDto, GetClustersResponseDto } from './dto/cluster.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('crm/cluster')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: GetClustersResponseDto,
  })
  async getClusters() {
    const data = await this.clusterService.getClusters();
    return {
      message: 'Success get list crm clusters',
      data,
    };
  }

  @Post()
  async createCluster(@Body() body: CreateClusterDto) {
    const data = await this.clusterService.createCluster(body);
    return {
      message: 'Success create crm cluster',
      data,
    };
  }
}
