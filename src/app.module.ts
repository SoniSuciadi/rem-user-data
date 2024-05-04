import { Module } from '@nestjs/common';
import { MasterModule } from './modules/master/master.module';
import { LandModule } from './modules/land/land.module';
import { PermittingModule } from './modules/permitting/permitting.module';
import { JobModule } from './modules/job/job.module';
import { DevelopmentModule } from './modules/development/development.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { DatabaseModule } from './common/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/logging/logging';

@Module({
  imports: [
    MasterModule,
    LandModule,
    PermittingModule,
    JobModule,
    DevelopmentModule,
    ProcurementModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
