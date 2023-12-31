import { Module } from '@nestjs/common';
import { BlockchainApiModule } from 'src/blockchain-api/blockchain-api.module';
import { PortfolioService } from './portfolio.service';
import { PortfolioController} from './portfolio.controller';
// import { MongooseModule } from '@nestjs/mongoose'; // If need mongoDB 

@Module({
  imports: [
    BlockchainApiModule,
  ],
  providers: [PortfolioService],
  controllers: [PortfolioController],
})
export class PortfolioModule { }

