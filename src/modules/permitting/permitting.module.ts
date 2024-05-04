import { Module } from '@nestjs/common';
import { PermittingService } from './permitting.service';
import { PermittingController } from './permitting.controller';

@Module({
  controllers: [PermittingController],
  providers: [PermittingService],
})
export class PermittingModule {}
