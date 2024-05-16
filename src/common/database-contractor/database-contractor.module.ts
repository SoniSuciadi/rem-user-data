import { Global, Module } from '@nestjs/common';
import { DatabaseContractorService } from './database-contractor.service';

@Global()
@Module({
  providers: [DatabaseContractorService],
  exports: [DatabaseContractorService],
})
export class DatabaseContractorModule {}
