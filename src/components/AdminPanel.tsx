import { useState } from "react";
import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/use-admin-store";
import { PACKAGE_ID, suiToMist } from "@/lib/sui-config";
import {
  Settings,
  Plus,
  RotateCw,
  Store,
  Loader2,
  ShieldAlert,
  BadgeAlert,
} from "lucide-react";

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
      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });
      toast({
        title: "Store created! 🏪",
        description: `Share the Store object ID from the transaction. Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
    } catch (err: unknown) {
      toast({
        title: "Failed to create store",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  // Add Product
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");

  const handleAddProduct = async () => {
    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productStock ||
      !productImageUrl
    ) {
      toast({ title: "Fill all product fields", variant: "destructive" });
      return;
    }
    if (!storeId) {
      toast({
        title: "Store not found",
        description: "Please create a store first",
        variant: "destructive",
      });
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
          tx.pure.vector("u8", Array.from(encoder.encode(productName))),
          tx.pure.vector("u8", Array.from(encoder.encode(productDescription))),
          tx.pure.u64(suiToMist(parseFloat(productPrice))),
          tx.pure.u64(parseInt(productStock)),
          tx.pure.vector("u8", Array.from(encoder.encode(productImageUrl))),
        ],
      });
      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });
      toast({
        title: "Product added! 📦",
        description: `Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductStock("");
      setProductImageUrl("");
    } catch (err: unknown) {
      toast({
        title: "Failed to add product",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  // Update Stock
  const [stockProductId, setStockProductId] = useState("");
  const [newStock, setNewStock] = useState("");

  const handleUpdateStock = async () => {
    if (!stockProductId || !newStock) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    if (!storeId) {
      toast({
        title: "Store not found",
        description: "Please create a store first",
        variant: "destructive",
      });
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
      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });
      toast({
        title: "Stock updated! ✅",
        description: `Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      setStockProductId("");
      setNewStock("");
    } catch (err: unknown) {
      toast({
        title: "Failed to update stock",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  // Delete Product
  const [deleteProductId, setDeleteProductId] = useState("");

  const handleDeleteProduct = async () => {
    if (!deleteProductId) {
      toast({ title: "Enter product ID", variant: "destructive" });
      return;
    }
    if (!storeId) {
      toast({
        title: "Store not found",
        description: "Please create a store first",
        variant: "destructive",
      });
      return;
    }
    setIsPending(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::store::delete_product`,
        arguments: [tx.object(storeId), tx.object(deleteProductId)],
      });
      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });
      toast({
        title: "Product deleted! 🗑️",
        description: `Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      setDeleteProductId("");
    } catch (err: unknown) {
      toast({
        title: "Failed to delete product",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
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
        <button className="neo-button bg-white p-2">
          <Settings className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto neo-border bg-[#FDFBF1]">
        <SheetHeader className="mb-8">
          <SheetTitle className="flex items-center gap-3 text-3xl font-black italic uppercase">
            <Settings className="h-8 w-8 text-black" />
            ADMIN CONTROL
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-10 pb-20">
          {/* Create Store */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
              <Store className="h-4 w-4" /> INITIALIZE STORE
            </h3>
            <button
              onClick={handleCreateStore}
              disabled={isPending}
              className="w-full neo-button bg-primary hover:bg-primary/90 text-black font-black flex items-center justify-center gap-2 py-4"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              CREATE STORE OBJECT
            </button>
          </section>

          <Separator className="bg-black/10" />

          {/* Add Product */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
              <Plus className="h-4 w-4" /> ADD NEW MERCH
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="pname"
                  className="text-[10px] font-black uppercase pl-1"
                >
                  Name
                </Label>
                <Input
                  id="pname"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="COOL T-SHIRT"
                  className="neo-border py-6 font-bold uppercase rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="pdesc"
                  className="text-[10px] font-black uppercase pl-1"
                >
                  Description
                </Label>
                <Input
                  id="pdesc"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="HIGH QUALITY"
                  className="neo-border py-6 font-bold uppercase rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pprice"
                    className="text-[10px] font-black uppercase pl-1"
                  >
                    Price (SUI)
                  </Label>
                  <Input
                    id="pprice"
                    type="number"
                    step="0.01"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="0.5"
                    className="neo-border py-6 font-bold rounded-xl text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pstock"
                    className="text-[10px] font-black uppercase pl-1"
                  >
                    Stock
                  </Label>
                  <Input
                    id="pstock"
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    placeholder="100"
                    className="neo-border py-6 font-bold rounded-xl text-center"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="pimg"
                  className="text-[10px] font-black uppercase pl-1"
                >
                  Image URL
                </Label>
                <Input
                  id="pimg"
                  value={productImageUrl}
                  onChange={(e) => setProductImageUrl(e.target.value)}
                  placeholder="HTTPS://..."
                  className="neo-border py-6 font-bold rounded-xl"
                />
              </div>
              <button
                onClick={handleAddProduct}
                disabled={isPending}
                className="w-full neo-button bg-primary hover:bg-primary/90 text-black font-black flex items-center justify-center gap-2 py-4 mt-2"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                ADD PRODUCT TO ON-CHAIN STORE
              </button>
            </div>
          </section>

          <Separator className="bg-black/10" />

          {/* Update Stock */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground">
              <RotateCw className="h-4 w-4" /> UPDATE INVENTORY
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="spid"
                  className="text-[10px] font-black uppercase pl-1"
                >
                  Product Object ID
                </Label>
                <Input
                  id="spid"
                  value={stockProductId}
                  onChange={(e) => setStockProductId(e.target.value)}
                  placeholder="0X..."
                  className="neo-border py-6 font-bold rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="sstock"
                  className="text-[10px] font-black uppercase pl-1"
                >
                  New Stock Level
                </Label>
                <Input
                  id="sstock"
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  placeholder="50"
                  className="neo-border py-6 font-bold rounded-xl"
                />
              </div>
              <button
                onClick={handleUpdateStock}
                disabled={isPending}
                className="w-full neo-button bg-white text-black font-black flex items-center justify-center gap-2 py-4"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RotateCw className="h-5 w-5" />
                )}
                RESTOCK PRODUCT
              </button>
            </div>
          </section>

          <Separator className="bg-black/10" />

          {/* Delete Product */}
          <section className="space-y-6">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase text-destructive">
              <BadgeAlert className="h-4 w-4" /> DANGER ZONE
            </h3>
            <div className="neo-card bg-destructive/5 border-destructive border-dashed p-4 space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="dpid"
                  className="text-[10px] font-black uppercase text-destructive pl-1"
                >
                  Product Object ID
                </Label>
                <Input
                  id="dpid"
                  value={deleteProductId}
                  onChange={(e) => setDeleteProductId(e.target.value)}
                  placeholder="0X..."
                  className="neo-border border-destructive/30 py-6 font-bold rounded-xl bg-white"
                />
              </div>
              <button
                onClick={handleDeleteProduct}
                disabled={isPending}
                className="w-full neo-button bg-destructive hover:bg-destructive/90 text-white font-black flex items-center justify-center gap-2 py-4"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShieldAlert className="h-5 w-5" />
                )}
                REMOVE PRODUCT PERMANENTLY
              </button>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminPanel;
