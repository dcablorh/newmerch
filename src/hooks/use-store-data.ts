import { useCurrentClient, useCurrentAccount as useCurrentAccountReact } from '@mysten/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';
import { PACKAGE_ID } from '@/lib/sui-config';
import type { Product, Receipt } from '@/types/store';

export { useCurrentAccountReact as useAccount };

export function useProductObjects() {
  const client = useCurrentClient();

  return useQuery({
    queryKey: ['product-objects'],
    retry: 1,
    queryFn: async (): Promise<Product[]> => {
      if (PACKAGE_ID.includes('YOUR_PACKAGE_ID')) return [];

      // Query ProductAdded events to find product objects
      const events = await client.queryEvents({
        query: { MoveEventType: `${PACKAGE_ID}::store::ProductAdded` },
        limit: 50,
        order: 'ascending',
      });

      if (events.data.length === 0) return [];

      // Get transaction digests to find created objects
      const txDigests = [...new Set(events.data.map((e) => e.id.txDigest))];
      const txDetails = await Promise.all(
        txDigests.map((digest) =>
          client.getTransactionBlock({
            digest,
            options: { showObjectChanges: true },
          })
        )
      );

      const productObjectIds: string[] = [];
      for (const tx of txDetails) {
        const changes = tx.objectChanges ?? [];
        for (const change of changes) {
          if (
            change.type === 'created' &&
            change.objectType === `${PACKAGE_ID}::store::Product`
          ) {
            productObjectIds.push(change.objectId);
          }
        }
      }

      if (productObjectIds.length === 0) return [];

      const objects = await client.multiGetObjects({
        ids: productObjectIds,
        options: { showContent: true },
      });

      return objects
        .filter((obj) => obj.data?.content?.dataType === 'moveObject')
        .map((obj) => {
          const fields = (obj.data!.content as { fields: Record<string, unknown> }).fields as {
            name: string;
            price: string;
            stock: string;
            walrus_blob_id: string;
            product_id: string;
          };
          return {
            objectId: obj.data!.objectId,
            name: fields.name,
            price: Number(fields.price),
            stock: Number(fields.stock),
            walrusBlobId: fields.walrus_blob_id,
            productId: Number(fields.product_id),
          };
        });
    },
    refetchInterval: 10000,
  });
}

export function useReceipts(owner?: string) {
  const client = useCurrentClient();

  return useQuery({
    queryKey: ['receipts', owner],
    queryFn: async (): Promise<Receipt[]> => {
      if (!owner) return [];

      const objects = await client.getOwnedObjects({
        owner,
        filter: { StructType: `${PACKAGE_ID}::store::Receipt` },
        options: { showContent: true },
      });

      return objects.data
        .filter((obj) => obj.data?.content?.dataType === 'moveObject')
        .map((obj) => {
          const fields = (obj.data!.content as { fields: Record<string, unknown> }).fields as {
            product_name: string;
            product_id: string;
            price_paid: string;
            buyer: string;
            walrus_blob_id: string;
            delivery_info: unknown;
            checkout_timestamp: string;
          };
          return {
            objectId: obj.data!.objectId,
            productName: fields.product_name,
            productId: Number(fields.product_id),
            pricePaid: Number(fields.price_paid),
            buyer: fields.buyer,
            walrusBlobId: fields.walrus_blob_id,
            checkoutTimestamp: Number(fields.checkout_timestamp),
          };
        });
    },
    enabled: !!owner,
  });
}
