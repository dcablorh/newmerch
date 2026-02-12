import { useCurrentClient, useCurrentAccount } from '@mysten/dapp-kit-react';
import { useQuery } from '@tanstack/react-query';
import { PACKAGE_ID, MERCH_STORE_ADDRESS } from '@/lib/sui-config';

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
      if (!account?.address) return null;

      // Query for Store objects owned by the current account
      const objects = await client.getOwnedObjects({
        owner: account.address,
        filter: { StructType: `${PACKAGE_ID}::store::Store` },
        options: { showContent: true },
      });

      if (objects.data.length === 0) return null;

      const obj = objects.data[0];
      if (!obj.data?.content || obj.data.content.dataType !== 'moveObject') return null;

      const fields = (obj.data.content as { fields: Record<string, unknown> }).fields as {
        admin: string;
      };

      return {
        objectId: obj.data.objectId,
        admin: fields.admin,
      };
    },
    enabled: !!account?.address,
    refetchInterval: 10000,
  });
}

export function useIsAdmin() {
  const account = useCurrentAccount();
  const { data: store, isLoading } = useAdminStore();

  const isAdmin = !!account && store?.admin === account.address;

  return {
    isAdmin,
    isLoading,
    account: account?.address,
    adminAddress: store?.admin,
    storeId: store?.objectId,
  };
}
