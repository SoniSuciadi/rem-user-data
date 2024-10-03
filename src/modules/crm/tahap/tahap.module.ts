import { Module } from '@nestjs/common';
import { TahapController } from './tahap.controller';
import { TahapService } from './tahap.service';

@Module({
  controllers: [TahapController],
  providers: [TahapService],
})
export class TahapModule {}
