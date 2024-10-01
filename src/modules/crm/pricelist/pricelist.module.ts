import { Module } from '@nestjs/common';
import { PricelistController } from './pricelist.controller';
import { PricelistService } from './pricelist.service';

@Module({
  controllers: [PricelistController],
  providers: [PricelistService],
})
export class PricelistModule {}
