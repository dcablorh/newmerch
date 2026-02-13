import { useState } from "react";
import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Product, DeliveryInfo } from "@/types/store";
import { PACKAGE_ID, formatSui } from "@/lib/sui-config";
import { Loader2, Zap, Truck, Package } from "lucide-react";

interface CheckoutDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const emptyDelivery: DeliveryInfo = {
  recipientName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
  email: "",
  phone: "",
};

const CheckoutDialog = ({ product, open, onClose }: CheckoutDialogProps) => {
  const account = useCurrentAccount();
  const dappKit = useDAppKit();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState<DeliveryInfo>(emptyDelivery);
  const [tab, setTab] = useState<string>("quick");
  const [isPending, setIsPending] = useState(false);

  if (!product) return null;

  const handleQuickPurchase = async () => {
    if (!account) {
      toast({ title: "Connect wallet first", variant: "destructive" });
      return;
    }

    setIsPending(true);
    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [product.price]);

      tx.moveCall({
        target: `${PACKAGE_ID}::store::purchase`,
        arguments: [tx.object(product.objectId), coin],
      });

      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });

      toast({
        title: "Purchase successful! 🎉",
        description: `Receipt NFT minted. Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      onClose();
    } catch (err: unknown) {
      toast({
        title: "Purchase failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleCheckout = async () => {
    if (!account) {
      toast({ title: "Connect wallet first", variant: "destructive" });
      return;
    }

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
        title: "Missing fields",
        description: "Please fill in all required delivery fields.",
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);
    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [product.price]);
      const encoder = new TextEncoder();

      tx.moveCall({
        target: `${PACKAGE_ID}::store::checkout`,
        arguments: [
          tx.object(product.objectId),
          coin,
          tx.pure.vector(
            "u8",
            Array.from(encoder.encode(delivery.recipientName)),
          ),
          tx.pure.vector(
            "u8",
            Array.from(encoder.encode(delivery.addressLine1)),
          ),
          tx.pure.vector(
            "u8",
            Array.from(encoder.encode(delivery.addressLine2)),
          ),
          tx.pure.vector("u8", Array.from(encoder.encode(delivery.city))),
          tx.pure.vector("u8", Array.from(encoder.encode(delivery.postalCode))),
          tx.pure.vector("u8", Array.from(encoder.encode(delivery.country))),
          tx.pure.vector("u8", Array.from(encoder.encode(delivery.email))),
          tx.pure.vector("u8", Array.from(encoder.encode(delivery.phone))),
        ],
      });

      const result = await dappKit.signAndExecuteTransaction({
        transaction: tx,
      });

      toast({
        title: "Checkout complete! 🎉",
        description: `Receipt NFT minted with delivery info. Digest: ${result.Transaction?.digest?.slice(0, 12)}...`,
      });
      onClose();
      setDelivery(emptyDelivery);
    } catch (err: unknown) {
      toast({
        title: "Checkout failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateField = (field: keyof DeliveryInfo, value: string) => {
    setDelivery((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[95vh] overflow-y-auto w-[95vw] sm:max-w-lg neo-border neo-shadow-lg p-0 bg-white rounded-2xl">
        <div className="p-4 sm:p-6 bg-primary border-b-2 border-black">
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Package className="w-6 sm:w-8 h-6 sm:h-8 text-black flex-shrink-0" />
              <DialogTitle className="text-2xl sm:text-3xl font-black italic uppercase text-black leading-none">
                CHECKOUT
              </DialogTitle>
            </div>
            <DialogDescription className="text-black font-bold uppercase text-xs">
              Review and confirm your purchase
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="neo-card bg-[#F5F5F5] p-3 sm:p-4 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-base sm:text-lg uppercase leading-tight">{product.name}</p>
              <p className="text-[8px] sm:text-[10px] font-black uppercase text-muted-foreground">
                PRODUCT #{product.productId}
              </p>
            </div>
            <p className="text-lg sm:text-xl font-black flex-shrink-0 whitespace-nowrap">{formatSui(product.price)} SUI</p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="neo-border bg-[#F5F5F5] h-10 sm:h-12 p-1 gap-1 sm:gap-2 rounded-lg sm:rounded-xl mb-4 sm:mb-6 w-full flex-wrap">
              <TabsTrigger
                value="quick"
                className="flex-1 font-black uppercase text-xs sm:text-sm data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-all min-w-fit"
              >
                <Zap className="h-3 sm:h-4 w-3 sm:w-4 mr-1" /> <span className="hidden xs:inline">Quick Buy</span>
              </TabsTrigger>
              <TabsTrigger
                value="delivery"
                className="flex-1 font-black uppercase text-xs sm:text-sm data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-all min-w-fit"
              >
                <Truck className="h-3 sm:h-4 w-3 sm:w-4 mr-1" /> <span className="hidden xs:inline">With Delivery</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="space-y-3 sm:space-y-4 outline-none">
              <div className="neo-card border-dashed bg-white p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase leading-tight">
                  Instant purchase — receive a Receipt NFT directly to your
                  wallet. You can provide delivery info later.
                </p>
                <Button
                  onClick={handleQuickPurchase}
                  disabled={isPending || !account}
                  className="w-full neo-button bg-primary hover:bg-primary/90 text-black font-black text-sm sm:text-base py-4 sm:py-6 h-auto"
                >
                  {isPending ? (
                    <Loader2 className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                  ) : (
                    <Zap className="h-4 sm:h-5 w-4 sm:w-5" />
                  )}
                  {isPending
                    ? "PROCESSING..."
                    : `PAY ${formatSui(product.price)} SUI`}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-3 sm:space-y-4 outline-none">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={delivery.recipientName}
                    onChange={(e) =>
                      updateField("recipientName", e.target.value)
                    }
                    placeholder="JOHN DOE"
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base placeholder:text-black/20"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label
                    htmlFor="addr1"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    Address Line 1 *
                  </Label>
                  <Input
                    id="addr1"
                    value={delivery.addressLine1}
                    onChange={(e) =>
                      updateField("addressLine1", e.target.value)
                    }
                    placeholder="123 MAIN ST"
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base placeholder:text-black/20"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label
                    htmlFor="addr2"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    Address Line 2
                  </Label>
                  <Input
                    id="addr2"
                    value={delivery.addressLine2}
                    onChange={(e) =>
                      updateField("addressLine2", e.target.value)
                    }
                    placeholder="APT, SUITE, ETC."
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base placeholder:text-black/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="city"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={delivery.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="postal"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    Postal Code *
                  </Label>
                  <Input
                    id="postal"
                    value={delivery.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="country"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    Country *
                  </Label>
                  <Input
                    id="country"
                    value={delivery.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    value={delivery.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-[8px] sm:text-[10px] font-black uppercase pl-1"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={delivery.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="YOU@EXAMPLE.COM"
                    className="neo-border rounded-lg sm:rounded-xl font-bold p-3 sm:p-4 text-sm sm:text-base placeholder:text-black/20"
                  />
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isPending || !account}
                className="w-full neo-button bg-primary hover:bg-primary/90 text-black font-black text-sm sm:text-base py-4 sm:py-6 h-auto mt-3 sm:mt-4"
              >
                {isPending ? (
                  <Loader2 className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                ) : (
                  <Truck className="h-4 sm:h-5 w-4 sm:w-5" />
                )}
                {isPending ? "PROCESSING..." : `COMPLETE PURCHASE`}
              </Button>
            </TabsContent>
          </Tabs>

          {!account && (
            <p className="text-center font-black uppercase text-xs bg-destructive/10 p-3 sm:p-4 rounded-lg sm:rounded-xl neo-border text-destructive">
              Please connect your wallet to purchase.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
