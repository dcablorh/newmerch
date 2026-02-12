// Deployed package ID
export const PACKAGE_ID =
  "0xee3b31435df25a8b913275b8f263f2a1bbc3cc196dad9fd7749e201b60d0423a";

// Replace with your store object ID after calling create_store
export const STORE_ID = "0xYOUR_STORE_ID";

// Smart contract object IDs from deployment
export const DISPLAY_ID =
  "0x693b9dca4c758e0da710572e29f106e6fc451f6a3a61888147c942e375919025";
export const PUBLISHER_ID =
  "0xe10ed04557f3ec86d8faa1c5071d9d23596a606dd285ad0897b61c8ed919e5f0";
export const UPGRADE_CAP_ID =
  "0x393eef81b177bcb867f35678731e753851048cf4e4ea84c02c116db7dcc945ff";

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
