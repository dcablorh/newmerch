import { useState } from 'react';
import {
  useCurrentAccount,
  useDAppKit,
} from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useIsAdmin } from '@/hooks/use-admin-store';
import { PACKAGE_ID, suiToMist } from '@/lib/sui-config';
import { Settings, Plus, RotateCw, Store, Loader2, ShieldAlert } from 'lucide-react';

const AdminPanel = () => {
  const account = useCurrentAccount();
  const dappKit = useDAppKit();
  const { toast } = useToast();
  const { isAdmin, isLoading: isCheckingAdmin, storeId } = useIsAdmin();
  const [isPending, setIsPending] = useState(false);

  // Create Store
  const handleCreateStore = async () => {
    setIsPending(true);
    try {
      const tx = new Transaction();
      tx.moveCall({ target: `${PACKAGE_ID}::store::create_store` });
      const result = await dappKit.signAndExecuteTransaction({ transaction: tx });
      toast({
        title: 'Store created! 🏪',
        description: `Share the Store object ID from the transaction. Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
    } catch (err: unknown) {
      toast({
        title: 'Failed to create store',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  // Add Product
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');

  const handleAddProduct = async () => {
    if (!productName || !productDescription || !productPrice || !productStock || !productImageUrl) {
      toast({ title: 'Fill all product fields', variant: 'destructive' });
      return;
    }
    if (!storeId) {
      toast({ title: 'Store not found', description: 'Please create a store first', variant: 'destructive' });
      return;
    }
    setIsPending(true);
    try {
      const tx = new Transaction();
      const encoder = new TextEncoder();
      tx.moveCall({
        target: `${PACKAGE_ID}::store::add_product`,
        arguments: [
          tx.object(storeId),
          tx.pure.vector('u8', Array.from(encoder.encode(productName))),
          tx.pure.vector('u8', Array.from(encoder.encode(productDescription))),
          tx.pure.u64(suiToMist(parseFloat(productPrice))),
          tx.pure.u64(parseInt(productStock)),
          tx.pure.vector('u8', Array.from(encoder.encode(productImageUrl))),
        ],
      });
      const result = await dappKit.signAndExecuteTransaction({ transaction: tx });
      toast({
        title: 'Product added! 📦',
        description: `Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      setProductName('');
      setProductDescription('');
      setProductPrice('');
      setProductStock('');
      setProductImageUrl('');
    } catch (err: unknown) {
      toast({
        title: 'Failed to add product',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  // Update Stock
  const [stockProductId, setStockProductId] = useState('');
  const [newStock, setNewStock] = useState('');

  const handleUpdateStock = async () => {
    if (!stockProductId || !newStock) {
      toast({ title: 'Fill all fields', variant: 'destructive' });
      return;
    }
    if (!storeId) {
      toast({ title: 'Store not found', description: 'Please create a store first', variant: 'destructive' });
      return;
    }
    setIsPending(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::store::update_stock`,
        arguments: [
          tx.object(storeId),
          tx.object(stockProductId),
          tx.pure.u64(parseInt(newStock)),
        ],
      });
      const result = await dappKit.signAndExecuteTransaction({ transaction: tx });
      toast({
        title: 'Stock updated! ✅',
        description: `Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      setStockProductId('');
      setNewStock('');
    } catch (err: unknown) {
      toast({
        title: 'Failed to update stock',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  // Delete Product
  const [deleteProductId, setDeleteProductId] = useState('');

  const handleDeleteProduct = async () => {
    if (!deleteProductId) {
      toast({ title: 'Enter product ID', variant: 'destructive' });
      return;
    }
    if (!storeId) {
      toast({ title: 'Store not found', description: 'Please create a store first', variant: 'destructive' });
      return;
    }
    setIsPending(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::store::delete_product`,
        arguments: [
          tx.object(storeId),
          tx.object(deleteProductId),
        ],
      });
      const result = await dappKit.signAndExecuteTransaction({ transaction: tx });
      toast({
        title: 'Product deleted! 🗑️',
        description: `Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      setDeleteProductId('');
    } catch (err: unknown) {
      toast({
        title: 'Failed to delete product',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  // Admin check
  if (isCheckingAdmin || !account) return null;
  
  if (!isAdmin) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="border-border/50">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Admin Panel
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Create Store */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <Store className="h-4 w-4" /> Initialize Store
            </h3>
            <Button
              onClick={handleCreateStore}
              disabled={isPending}
              variant="outline"
              className="w-full gap-2"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Store
            </Button>
          </section>

          <Separator />

          {/* Add Product */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <Plus className="h-4 w-4" /> Add Product
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="pname">Product Name</Label>
                <Input id="pname" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Cool T-Shirt" />
              </div>
              <div>
                <Label htmlFor="pdesc">Description</Label>
                <Input id="pdesc" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="High quality merchandise" />
              </div>
              <div>
                <Label htmlFor="pprice">Price (SUI)</Label>
                <Input id="pprice" type="number" step="0.01" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="0.5" />
              </div>
              <div>
                <Label htmlFor="pstock">Stock</Label>
                <Input id="pstock" type="number" value={productStock} onChange={(e) => setProductStock(e.target.value)} placeholder="100" />
              </div>
              <div>
                <Label htmlFor="pimg">Image URL</Label>
                <Input id="pimg" value={productImageUrl} onChange={(e) => setProductImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <Button onClick={handleAddProduct} disabled={isPending} className="w-full gap-2">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add Product
              </Button>
            </div>
          </section>

          <Separator />

          {/* Update Stock */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <RotateCw className="h-4 w-4" /> Update Stock
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="spid">Product Object ID</Label>
                <Input id="spid" value={stockProductId} onChange={(e) => setStockProductId(e.target.value)} placeholder="0x..." />
              </div>
              <div>
                <Label htmlFor="sstock">New Stock</Label>
                <Input id="sstock" type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} placeholder="50" />
              </div>
              <Button onClick={handleUpdateStock} disabled={isPending} variant="outline" className="w-full gap-2">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                Update Stock
              </Button>
            </div>
          </section>

          <Separator />

          {/* Delete Product */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4 text-destructive" /> Delete Product
            </h3>
            <div className="space-y-3">
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  This action cannot be undone.
                </AlertDescription>
              </Alert>
              <div>
                <Label htmlFor="dpid">Product Object ID</Label>
                <Input id="dpid" value={deleteProductId} onChange={(e) => setDeleteProductId(e.target.value)} placeholder="0x..." />
              </div>
              <Button onClick={handleDeleteProduct} disabled={isPending} variant="destructive" className="w-full gap-2">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                Delete Product
              </Button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminPanel;
