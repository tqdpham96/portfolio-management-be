import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

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

@Injectable()
export class BlockchainApiService {
    constructor() { }

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

        const raw = JSON.stringify({
            jsonrpc: '2.0',
            method: 'ankr_getTokenTransfers',
            params: query,
            id: 1,
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: raw,
            redirect: 'follow',
        };

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
        const raw = JSON.stringify({
            jsonrpc: '2.0',
            method: 'ankr_getAccountBalance',
            params: {
                walletAddress: params.wallet,
                nativeFirst: true,
                onlyWhitelisted: true,
                blockchain: params.networks
            },
            id: 1,
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: raw,
            redirect: 'follow',
        };

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
        const raw = JSON.stringify({
            jsonrpc: '2.0',
            method: 'ankr_getAccountBalanceHistorical',
            params: {
                walletAddress: params.wallet,
                blockchain: params.networks,
                pageSize: params.limit,
                blockHeight: params.block
            },
            id: 1,
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: raw,
            redirect: 'follow',
        };

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
        const raw = JSON.stringify({
            jsonrpc: '2.0',
            method: 'ankr_getNFTsByOwner',
            params: {
                walletAddress: params.wallet,
                blockchain: params.networks
            },
            id: 1,
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            body: raw,
            redirect: 'follow',
        };

        const response = await fetch(
            `${process.env.ANKR_ENDPOINT}/?ankr_getNFTsByOwner=`,
            requestOptions,
        );
        const logRes = await response.json();
        return logRes
    };
}
