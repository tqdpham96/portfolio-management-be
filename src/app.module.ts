import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainApiService } from './blockchain-api/blockchain-api.service';
import { BlockchainApiModule } from './blockchain-api/blockchain-api.module';
import { PortfolioService } from './portfolio/portfolio.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BlockchainApiModule,
    PortfolioModule],
  controllers: [AppController],
  providers: [AppService, BlockchainApiService, PortfolioService],
})

export class AppModule { }
