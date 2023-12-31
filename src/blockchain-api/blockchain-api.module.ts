import { Module } from '@nestjs/common';
import { BlockchainApiService } from './blockchain-api.service';

@Module({
  providers: [BlockchainApiService],
  exports: [BlockchainApiService],
})
export class BlockchainApiModule {}
