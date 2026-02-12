import { createDAppKit } from '@mysten/dapp-kit-react';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

const RPC_URLS: Record<string, string> = {
  testnet: 'https://fullnode.testnet.sui.io:443',
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

export const dAppKit = createDAppKit({
  networks: ['testnet', 'mainnet', 'devnet'] as const,
  createClient(network) {
    return new SuiJsonRpcClient({ url: RPC_URLS[network], network });
  },
});

declare module '@mysten/dapp-kit-react' {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
