import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { ClusterModule } from './cluster/cluster.module';
import { PricelistModule } from './pricelist/pricelist.module';
import { UnitModule } from './unit/unit.module';
import { HomeDesignModule } from './homeDesign/homeDesign.module';

@Module({
  imports: [
    ProjectModule,
    ClusterModule,
    PricelistModule,
    UnitModule,
    HomeDesignModule,
  ],
})
export class CrmModule {}
