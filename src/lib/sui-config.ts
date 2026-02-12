// Deployed package ID
export const PACKAGE_ID = '0xc86a517ebf83b4974fa6b6edda66da84e03011fb0d73a75aa0c8d8c1d04f66cf';

// Replace with your store object ID after calling create_store
export const STORE_ID = '0xYOUR_STORE_ID';

// Smart contract object IDs from deployment
export const DISPLAY_ID = '0x65edce5eab8e3d763651478f6db88f6aea8a18f053fc82c3cfdeaca997756033';
export const PUBLISHER_ID = '0xf4731bf16c64530b2d07174f172766f41844e2bb036908b136e77cdbc11f9a73';
export const UPGRADE_CAP_ID = '0x34f05c82cb3a14b161bf1c5bfc2d47a66e11bf635f4395d617f8c163ea715226';

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
