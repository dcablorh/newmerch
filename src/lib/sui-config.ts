// Deployed package ID
export const PACKAGE_ID = '0xa42a0d888a083e52e75b2e7c47962696c11da233fea531e413674346208e6385';

// Replace with your store object ID after calling create_store
export const STORE_ID = '0xYOUR_STORE_ID';

// Admin / merch_store address (where payments go)
export const MERCH_STORE_ADDRESS = '0xe2bf986ccb385f8e5d9500ce8332b69a5cee19579152c240c09213e80e9355b8';

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
