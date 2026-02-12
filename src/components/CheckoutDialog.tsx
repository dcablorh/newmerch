import { useState } from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Product, DeliveryInfo } from '@/types/store';
import { PACKAGE_ID, formatSui } from '@/lib/sui-config';
import { Loader2, Zap, Truck } from 'lucide-react';

interface CheckoutDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const emptyDelivery: DeliveryInfo = {
  recipientName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postalCode: '',
  country: '',
  email: '',
  phone: '',
};

const CheckoutDialog = ({ product, open, onClose }: CheckoutDialogProps) => {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState<DeliveryInfo>(emptyDelivery);
  const [tab, setTab] = useState<string>('quick');

  if (!product) return null;

  const handleQuickPurchase = async () => {
    if (!account) {
      toast({ title: 'Connect wallet first', variant: 'destructive' });
      return;
    }

    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [product.price]);

      tx.moveCall({
        target: `${PACKAGE_ID}::store::purchase`,
        arguments: [tx.object(product.objectId), coin],
      });

      const result = await signAndExecute({ transaction: tx });

      toast({
        title: 'Purchase successful! 🎉',
        description: `Receipt NFT minted. Digest: ${result.digest.slice(0, 12)}...`,
      });
      onClose();
    } catch (err: unknown) {
      toast({
        title: 'Purchase failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const handleCheckout = async () => {
    if (!account) {
      toast({ title: 'Connect wallet first', variant: 'destructive' });
      return;
    }

    // Validate required fields
    if (
      !delivery.recipientName ||
      !delivery.addressLine1 ||
      !delivery.city ||
      !delivery.postalCode ||
      !delivery.country ||
      !delivery.email ||
      !delivery.phone
    ) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required delivery fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [product.price]);
      const encoder = new TextEncoder();

      tx.moveCall({
        target: `${PACKAGE_ID}::store::checkout`,
        arguments: [
          tx.object(product.objectId),
          coin,
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.recipientName))),
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.addressLine1))),
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.addressLine2))),
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.city))),
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.postalCode))),
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.country))),
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.email))),
          tx.pure.vector('u8', Array.from(encoder.encode(delivery.phone))),
        ],
      });

      const result = await signAndExecute({ transaction: tx });

      toast({
        title: 'Checkout complete! 🎉',
        description: `Receipt NFT minted with delivery info. Digest: ${result.digest.slice(0, 12)}...`,
      });
      onClose();
      setDelivery(emptyDelivery);
    } catch (err: unknown) {
      toast({
        title: 'Checkout failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  const updateField = (field: keyof DeliveryInfo, value: string) => {
    setDelivery((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>
            <span className="gradient-text font-mono text-lg font-bold">
              {formatSui(product.price)} SUI
            </span>
            {' · '}
            {product.stock} in stock
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="quick" className="flex-1 gap-2">
              <Zap className="h-4 w-4" /> Quick Buy
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex-1 gap-2">
              <Truck className="h-4 w-4" /> With Delivery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Instant purchase — receive a Receipt NFT without delivery details.
            </p>
            <Button
              onClick={handleQuickPurchase}
              disabled={isPending || !account}
              className="w-full gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {isPending ? 'Processing...' : `Pay ${formatSui(product.price)} SUI`}
            </Button>
          </TabsContent>

          <TabsContent value="delivery" className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={delivery.recipientName}
                  onChange={(e) => updateField('recipientName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="addr1">Address Line 1 *</Label>
                <Input
                  id="addr1"
                  value={delivery.addressLine1}
                  onChange={(e) => updateField('addressLine1', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="addr2">Address Line 2</Label>
                <Input
                  id="addr2"
                  value={delivery.addressLine2}
                  onChange={(e) => updateField('addressLine2', e.target.value)}
                  placeholder="Apt 4B"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={delivery.city}
                  onChange={(e) => updateField('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="postal">Postal Code *</Label>
                <Input
                  id="postal"
                  value={delivery.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={delivery.country}
                  onChange={(e) => updateField('country', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={delivery.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={delivery.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isPending || !account}
              className="w-full gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Truck className="h-4 w-4" />
              )}
              {isPending ? 'Processing...' : `Checkout ${formatSui(product.price)} SUI`}
            </Button>
          </TabsContent>
        </Tabs>

        {!account && (
          <p className="text-center text-sm text-destructive">
            Please connect your wallet to purchase.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
