import { Injectable } from '@nestjs/common';
import { BlockchainApiService, BalanceHistoryIF, AnkrTokenTransfersIF, NFTResponseIF } from 'src/blockchain-api/blockchain-api.service';

@Injectable()
export class PortfolioService {
    private ethBlockPerDay = 7128;
    private chain_name = 'ethereum';
    private chain_id = 1;
    private chain_ankr = 'eth';

    constructor(
        private blockchainApiService: BlockchainApiService
    ) { }

    // can improve later
    getDateLists = () => {
        // Get today's date
        const today = new Date();

        // Array to store the last 7 days
        const last7Days = [];

        // Get the current day of the week (0 is Sunday, 1 is Monday, etc.)
        const currentDayOfWeek = today.getDay();

        // Calculate the date for each of the last 7 days
        for (let i = currentDayOfWeek; i > currentDayOfWeek - 7; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            last7Days.push(day.toLocaleDateString(undefined, { weekday: 'long' }));
        }
        return last7Days.reverse()
    };

    getWalletHistoryChartData = async () => {
        const wallet = process.env.WALLET;
        const dates = this.getDateLists();

        const currentBlock: number = await this.blockchainApiService.getDateToBlock(
            Math.round(new Date().getTime() / 1000), this.chain_name
        );
        const blockData: number[] = Array.from(
            { length: 7 }, (_, index) => currentBlock ? currentBlock - index * this.ethBlockPerDay : 0
        );

        const balanceHistory: number[] = await Promise.all(blockData.reverse().map(async (block) => {
            const balance: BalanceHistoryIF = await this.blockchainApiService.getBalanceHistoryAnkr({
                wallet: wallet,
                networks: [this.chain_ankr],
                block: block,
                limit: 1,
            });
            return Number(balance?.result?.totalBalanceUsd);
        }));

        return {
            dates: dates,
            balances: balanceHistory
        }
    }

    getWalletCurrentBalanceData = async () => {
        const wallet = process.env.WALLET;
        const balanceNow: BalanceHistoryIF =
            await this.blockchainApiService.getBalanceAnkr({ wallet: wallet, networks: [this.chain_ankr] });

        const blockLastYear: number = await this.blockchainApiService.getDateToBlock(
            Math.round((new Date().getTime() - 365 * 24 * 60 * 60 * 1000) / 1000), this.chain_name
        );

        const balanceLastYear: BalanceHistoryIF =
            await this.blockchainApiService.getBalanceHistoryAnkr({
                wallet: wallet,
                networks: [this.chain_ankr],
                block: blockLastYear,
                limit: 1,
            });

        const nativeToken: number = balanceNow.result.assets
            .filter(e => e.tokenType === "NATIVE")
            .reduce((acc, val) => acc + Number(val.balanceUsd), 0)

        return {
            balanceNow: Number(balanceNow.result.totalBalanceUsd),
            balanceLastYear: Number(balanceLastYear.result.totalBalanceUsd),
            nativeToken: nativeToken
        }
    }

    getWalletTransactionSummaryData = async () => {
        const wallet = process.env.WALLET;
        const blockLastYear: number = await this.blockchainApiService.getDateToBlock(
            Math.round((new Date().getTime() - 365 * 24 * 60 * 60 * 1000) / 1000), this.chain_name
        );
        const txnNow: number = await this.blockchainApiService.getWalletTransactionCount({
            wallet: wallet
        });
        const txnLastYear: number = await this.blockchainApiService.getWalletTransactionCount({
            wallet: wallet, block: blockLastYear
        });

        return {
            txnCountNow: txnNow,
            txnCountLastYear: txnLastYear
        }
    };

    getWalletLatestTokenTransfers = async () => {
        const wallet = process.env.WALLET;
        const data: AnkrTokenTransfersIF = await this.blockchainApiService.getTokenTransferByAddressAnkr({
            address: wallet,
            networks: [this.chain_ankr],
            limit: 7
        })
        return data.result.transfers
    }

    getWalletTokenHolding = async () => {
        const wallet = process.env.WALLET;
        const tokens: BalanceHistoryIF = await this.blockchainApiService.getBalanceAnkr({
            wallet: wallet,
            networks: [this.chain_ankr],
        })
        return tokens.result.assets
    }

    getWalletNFTHolding = async () => {
        const wallet = process.env.WALLET;
        const nfts: NFTResponseIF = await this.blockchainApiService.getNFTAnkr({
            wallet: wallet,
            networks: [this.chain_ankr],
        })
        return nfts.result.assets
    }

    getMarketSummary = async () => {
        const market = await this.blockchainApiService.getMarketData();
        const defi = await this.blockchainApiService.getDefiData();
        return {
            coins: market.active_cryptocurrencies,
            market_cap: market.total_market_cap.usd,
            volume: market.total_volume.usd,
            market_cap_percentage: market.market_cap_percentage.btc,
            defi_market_cap: Number(defi.defi_market_cap),
            trading_volume_24h: Number(defi.trading_volume_24h)
        }
    }
}
