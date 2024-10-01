import { Module } from '@nestjs/common';
import { PricelistController } from './cluster.controller';
import { PricelistService } from './cluster.service';

@Module({
  controllers: [PricelistController],
  providers: [PricelistService],
})
export class PricelistModule {}
