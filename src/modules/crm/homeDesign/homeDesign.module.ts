import { Module } from '@nestjs/common';
import { HomeDesignController } from './homeDesign.controller';
import { HomeDesignService } from './homeDesign.service';

@Module({
  controllers: [HomeDesignController],
  providers: [HomeDesignService],
})
export class HomeDesignModule {}
