// Deployed package ID
export const PACKAGE_ID =
  "0xf8a5385c28ab4f4deb9b7bf4f0a63fed11653cc358f9589aa4075ffb891d8eae";

// Replace with your store object ID after calling create_store
export const STORE_ID = "0xYOUR_STORE_ID";

// Smart contract object IDs from deployment
export const DISPLAY_ID =
  "0x7c69d5ddcdb2368a2757a9bec9f86e315c878fa169011cd12230fa7b084a8e76";
export const PUBLISHER_ID =
  "0x342350d99e95562eaa8f56c088a7354da517e9dfa9975cbbc9fccca3f7f571d2";
export const UPGRADE_CAP_ID =
  "0xa479b90dbba4fb9c2d4f8565e42c44a1e2cdecd429264ffe9f53a7538fa67a86";

// Admin / merch_store address (where payments go)
export const MERCH_STORE_ADDRESS =
  "0xe2bf986ccb385f8e5d9500ce8332b69a5cee19579152c240c09213e80e9355b8";

export const NETWORK = "testnet" as const;

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
