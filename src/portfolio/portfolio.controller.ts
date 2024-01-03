import {
    Controller,
    Get,
} from '@nestjs/common';
import {
    ApiInternalServerErrorResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';

@Controller('api/v1/portfolio')
@ApiTags('Portfolio Balance APIs')
export class PortfolioController {
    constructor(
        private service: PortfolioService,
    ) { }

    @Get('/market-summary')
    @ApiOperation({
        summary: 'Get Market Summary',
        description: 'Get Market Summary',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    public async getMarketSummaryAPI(
    ) {
        return await this.service.getMarketSummary();
    }

    @Get('/history')
    @ApiOperation({
        summary: 'Get Portfolio Balance History',
        description: 'Get Portfolio Balance History',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    public async getPortfolioBalanceHistoryAPI(
    ) {
        return await this.service.getWalletHistoryChartData();
    }

    @Get('/balance')
    @ApiOperation({
        summary: 'Get Portfolio Balance',
        description: 'Get Portfolio Balance',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    public async getPortfolioBalanceAPI(
    ) {
        return await this.service.getWalletCurrentBalanceData();
    }

    @Get('/transaction')
    @ApiOperation({
        summary: 'Get Wallet Transaction Summary',
        description: 'Get Wallet Transaction Summary',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    public async getTransactionSummaryAPI(
    ) {
        return await this.service.getWalletTransactionSummaryData();
    }

    @Get('/token-transfers')
    @ApiOperation({
        summary: 'Get Wallet Latest Token Transfers',
        description: 'Get Wallet Latest Token Transfers',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    public async getTokenTransfersAPI(
    ) {
        return await this.service.getWalletLatestTokenTransfers();
    }

    @Get('/token-holding')
    @ApiOperation({
        summary: 'Get Wallet Token Holding Transfers',
        description: 'Get Wallet Token Holding Transfers',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    public async getTokenHoldingAPI(
    ) {
        return await this.service.getWalletTokenHolding();
    }

    @Get('/nft-holding')
    @ApiOperation({
        summary: 'Get Wallet NFT Holding Transfers',
        description: 'Get Wallet NFT Holding Transfers',
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
    })
    public async getNFTHoldingAPI(
    ) {
        return await this.service.getWalletNFTHolding();
    }
}
