import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import Web3 from 'web3';

export interface AssetIF {
    blockchain: string,
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenType: string,
    holderAddress: string,
    balance: string,
    balanceRawInteger: string,
    balanceUsd: string,
    tokenPrice: string,
    thumbnail: string
}

export interface ResultHistoryIF {
    totalBalanceUsd: number,
    totalCount: number,
    assets: AssetIF[]
}

export interface BalanceHistoryIF {
    jsonrpc: string,
    id: number,
    result: ResultHistoryIF
}

export interface TokenTransfersIF {
    fromAddress: string,
    toAddress: string,
    contractAddress: string,
    value: string,
    valueRawInteger: string,
    blockchain: string,
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: number,
    thumbnail: string,
    transactionHash: string,
    blockHeight: number,
    timestamp: number
}


export interface AnkrTokenTransfersIF {
    jsonrpc: string,
    id: number,
    result: { transfers: TokenTransfersIF[] }
}

export interface NFTResultIF {
    blockchain: string,
    name: string,
    tokenId: string,
    tokenUrl: string,
    imageUrl: string,
    collectionName: string,
    symbol: string,
    contractType: string,
    contractAddress: string,
    quantity: string
}

export interface NFTResponseIF {
    jsonrpc: string,
    id: number,
    result: {
        owner: string,
        assets: NFTResultIF[]
    }
}

export interface MarketCGCIF {
    active_cryptocurrencies: number,
    total_market_cap: {
        usd: number,
    },
    total_volume: {
        usd: number,
    },
    market_cap_percentage: {
        btc: number,
    },
}

export interface DeFiCGCIF {
    defi_market_cap: string,
    eth_market_cap: string,
    defi_to_eth_ratio: string,
    trading_volume_24h: string,
    defi_dominance: string,
    top_coin_name: string,
    top_coin_defi_dominance: number
}



@Injectable()
export class BlockchainApiService {
    constructor() { }

    getAnkrRequestOption = (params: { method: string, query: any }) => {
        const body = JSON.stringify({
            jsonrpc: '2.0',
            method: params.method,
            params: params.query,
            id: 1,
        });
        return {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: body,
            redirect: 'follow',
        }
    }

    getTokenTransferByAddressAnkr = async (params: {
        address: string,
        fromTimestamp?: number,
        networks: string[],
        limit: number,
    }): Promise<AnkrTokenTransfersIF> => {
        const query = {
            descOrder: true,
            address: [
                params.address
            ],
            blockchain: params.networks,
            pageSize: params.limit
        }
        if (params.fromTimestamp) {
            query['fromTimestamp'] = params.fromTimestamp
        }
        const requestOptions = this.getAnkrRequestOption({ method: 'ankr_getTokenTransfers', query: query })

        const response = await fetch(
            `${process.env.ANKR_ENDPOINT}/?ankr_getTokenTransfers=`,
            requestOptions,
        );
        const logRes = await response.json();
        return logRes;
    };

    async getDateToBlock(timestamp: number, chain: string) {
        const url = "https://coins.llama.fi/block/" + chain + "/" + String(timestamp)
        try {
            const response = await fetch(url)
            const data = await response.json()
            return data.height
        } catch {
            return null
        }
    }

    getBalanceAnkr = async (
        params: {
            wallet: string,
            networks: string[],
        }
    ): Promise<BalanceHistoryIF> => {
        const requestOptions = this.getAnkrRequestOption({
            method: 'ankr_getAccountBalance',
            query: {
                walletAddress: params.wallet,
                nativeFirst: true,
                onlyWhitelisted: true,
                blockchain: params.networks
            },
        })

        const response = await fetch(
            `${process.env.ANKR_ENDPOINT}/?ankr_getAccountBalance=`,
            requestOptions,
        );
        const logRes = await response.json();
        return logRes
    };

    getBalanceHistoryAnkr = async (
        params: {
            wallet: string,
            networks: string[],
            block: number,
            limit: number
        }
    ): Promise<BalanceHistoryIF> => {
        const requestOptions = this.getAnkrRequestOption({
            method: 'ankr_getAccountBalanceHistorical',
            query: {
                walletAddress: params.wallet,
                blockchain: params.networks,
                pageSize: params.limit,
                blockHeight: params.block
            },
        })

        const response = await fetch(
            `${process.env.ANKR_ENDPOINT}/?ankr_getAccountBalanceHistorical=`,
            requestOptions,
        );
        const logRes = await response.json();
        return logRes
    };

    getNFTAnkr = async (
        params: {
            wallet: string,
            networks: string[],
        }
    ): Promise<NFTResponseIF> => {
        const requestOptions = this.getAnkrRequestOption({
            method: 'ankr_getNFTsByOwner',
            query: {
                walletAddress: params.wallet,
                blockchain: params.networks
            },
        })

        const response = await fetch(
            `${process.env.ANKR_ENDPOINT}/?ankr_getNFTsByOwner=`,
            requestOptions,
        );
        const logRes = await response.json();
        return logRes
    };

    getMarketData = async () => {
        // It is best practice to define the interface for response
        const response = await fetch("https://api.coingecko.com/api/v3/global");
        const dataJson: { data?: MarketCGCIF } = await response.json()
        return dataJson?.data
    }

    getDefiData = async () => {
        // It is best practice to define the interface for response
        const response = await fetch("https://api.coingecko.com/api/v3/global/decentralized_finance_defi");
        const dataJson: { data?: DeFiCGCIF } = await response.json()
        return dataJson?.data
    }

    getWalletTransactionCount = async (params: { wallet: string, block?: number }) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ANKR_ENDPOINT_ETH));
        const txnCount: number = params.block ?
            Number(await web3.eth.getTransactionCount(params.wallet, params.block)) :
            Number(await web3.eth.getTransactionCount(params.wallet))
        return txnCount
    }
}
