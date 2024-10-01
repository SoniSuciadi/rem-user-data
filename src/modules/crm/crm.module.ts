import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { ClusterModule } from './cluster/cluster.module';

@Module({
  imports: [ProjectModule, ClusterModule],
})
export class CrmModule {}
