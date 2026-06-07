import { JsonApiData } from "./common";

export enum VaultNetwork {
    ArbitrumOne = 'arbitrum_one',
    Ethereum = 'ethereum',
    Base = 'base',
    Sepolia = 'sepolia',
    HyperEvmTestnet = 'hyperevm_testnet',
    HyperEvmMainnet = 'hyperevm',
    ArbitrumSepolia = 'arbitrum_sepolia',
}

export type VaultDataV2 = JsonApiData<{
    ui_category: string | null;
    name: string;
    deposit_asset: Array<string>;
    chain: VaultNetwork;
    tvl: number;
    tvl_usd: number;
    apy: number;
    apy_15d: number;
    contract_address: string;
    contract_reader_address: string;
    apy_45d: number;
    slug: string;
    vault_currency: string;
    price_per_share: number;
    rewards?: Array<string> | null;
    tags: string | null;
    supported_networks: Array<{
        chain: VaultNetwork;
        vault_slug: string;
    }>;
}>;


export type VaultV2Response = {
    data: Array<VaultDataV2>;
};
