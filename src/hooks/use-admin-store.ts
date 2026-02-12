import { useCurrentClient, useCurrentAccount } from '@mysten/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';
import { PACKAGE_ID } from '@/lib/sui-config';

export interface StoreObject {
  objectId: string;
  admin: string;
}

export function useAdminStore() {
  const client = useCurrentClient();
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ['admin-store', account?.address],
    queryFn: async (): Promise<StoreObject | null> => {
      if (!account?.address) {
        console.log('[Store] No account connected');
        return null;
      }

      try {
        // Query for StoreCreated events to get store_id and admin
        const events = await client.queryEvents({
          query: { MoveEventType: `${PACKAGE_ID}::store::StoreCreated` },
          limit: 50,
          order: 'descending',
        });

        console.log('[Store] StoreCreated events found:', events.data.length);

        if (events.data.length === 0) {
          console.log('[Store] No StoreCreated event found');
          return null;
        }

        // Get the most recent store event
        const event = events.data[0];
        const parsedJson = event.parsedJson as {
          admin?: string;
          store_id?: string;
        };

        console.log('[Store] Event data:', {
          admin: parsedJson.admin,
          storeId: parsedJson.store_id,
          currentAddress: account.address,
        });

        if (!parsedJson.admin || !parsedJson.store_id) {
          console.log('[Store] Invalid event data');
          return null;
        }

        return {
          objectId: parsedJson.store_id,
          admin: parsedJson.admin,
        };
      } catch (error) {
        console.error('[Store] Error querying store event:', error);
        return null;
      }
    },
    enabled: !!account?.address,
    refetchInterval: 10000,
  });
}

export function useIsAdmin() {
  const account = useCurrentAccount();
  const { data: store, isLoading, error } = useAdminStore();

  const isAdmin = !!(account && store && store.admin === account.address);

  console.log('[Admin Check]', {
    hasAccount: !!account,
    hasStore: !!store,
    currentAddress: account?.address,
    storeAdmin: store?.admin,
    isAdmin,
    isLoading,
  });

  return {
    isAdmin,
    isLoading,
    account: account?.address,
    adminAddress: store?.admin,
    storeId: store?.objectId,
    hasStore: !!store,
    error: error instanceof Error ? error.message : null,
  };
}
