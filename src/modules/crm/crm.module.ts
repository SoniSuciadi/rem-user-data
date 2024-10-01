import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { ClusterModule } from './cluster/cluster.module';
import { PricelistModule } from './pricelist/cluster.module';

@Module({
  imports: [ProjectModule, ClusterModule, PricelistModule],
})
export class CrmModule {}
