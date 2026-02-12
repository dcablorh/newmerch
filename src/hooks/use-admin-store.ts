import { useCurrentClient, useCurrentAccount } from '@mysten/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';
import { PACKAGE_ID, MERCH_STORE_ADDRESS } from '@/lib/sui-config';

export interface StoreObject {
  objectId: string;
  admin: string;
}

export function useAdminStore() {
  const client = useCurrentClient();

  return useQuery({
    queryKey: ['admin-store'],
    queryFn: async (): Promise<StoreObject | null> => {
      try {
        console.log('[Store] Querying with PACKAGE_ID:', PACKAGE_ID);

        // Query for StoreCreated events by sender (admin address)
        const events = await client.queryEvents({
          query: {
            MoveEventType: `${PACKAGE_ID}::store::StoreCreated`,
          },
          limit: 100,
          order: 'descending',
        });

        console.log('[Store] StoreCreated events found:', events.data.length);

        if (events.data.length === 0) {
          console.log('[Store] No StoreCreated events found. Trying alternative query...');
          
          // Try querying by sender
          const eventsBySender = await client.queryEvents({
            query: {
              Sender: MERCH_STORE_ADDRESS,
            },
            limit: 100,
            order: 'descending',
          });

          console.log('[Store] Events by sender found:', eventsBySender.data.length);

          // Filter for StoreCreated events
          const storeCreatedEvent = eventsBySender.data.find(
            (e) => e.type.includes('::store::StoreCreated')
          );

          if (!storeCreatedEvent) {
            console.log('[Store] No StoreCreated event found in sender events');
            return null;
          }

          const parsedJson = storeCreatedEvent.parsedJson as {
            store_id?: string;
          };

          console.log('[Store] Event found via sender query:', {
            sender: storeCreatedEvent.sender,
            storeId: parsedJson.store_id,
            eventType: storeCreatedEvent.type,
          });

          if (!parsedJson.store_id) {
            console.log('[Store] Invalid event data - missing store_id');
            return null;
          }

          return {
            objectId: parsedJson.store_id,
            admin: MERCH_STORE_ADDRESS,
          };
        }

        // Get the most recent store event
        const event = events.data[0];
        const parsedJson = event.parsedJson as {
          store_id?: string;
        };

        console.log('[Store] Event data from primary query:', {
          sender: event.sender,
          storeId: parsedJson.store_id,
          eventType: event.type,
        });

        if (!parsedJson.store_id) {
          console.log('[Store] Invalid event data - missing store_id');
          return null;
        }

        return {
          objectId: parsedJson.store_id,
          admin: MERCH_STORE_ADDRESS,
        };
      } catch (error) {
        console.error('[Store] Error querying store event:', error);
        return null;
      }
    },
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
    adminAddress: store?.admin,
    isAdmin,
    isLoading,
    matchesAdmin: account?.address === store?.admin,
    packageId: PACKAGE_ID,
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
