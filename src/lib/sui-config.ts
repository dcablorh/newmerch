// Replace with your deployed package ID
export const PACKAGE_ID = '0xYOUR_PACKAGE_ID';

// Replace with your store object ID after calling create_store
export const STORE_ID = '0xYOUR_STORE_ID';

// Replace with the merch_store address (where payments go)
export const MERCH_STORE_ADDRESS = '0xYOUR_MERCH_STORE_ADDRESS';

export const NETWORK = 'testnet' as const;

// 1 SUI = 1_000_000_000 MIST
export const MIST_PER_SUI = 1_000_000_000;

export const formatSui = (mist: number | bigint): string => {
  const sui = Number(mist) / MIST_PER_SUI;
  return sui.toFixed(sui < 0.01 ? 4 : 2);
};

export const suiToMist = (sui: number): number => {
  return Math.floor(sui * MIST_PER_SUI);
};

export const walrusImageUrl = (blobId: string): string => {
  return `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${blobId}`;
};
