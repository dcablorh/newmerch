import { useCurrentAccount } from "@mysten/dapp-kit-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReceipts } from "@/hooks/use-store-data";
import { formatSui } from "@/lib/sui-config";
import { Receipt, ScrollText, ArrowRight } from "lucide-react";

const ReceiptsPanel = () => {
  const account = useCurrentAccount();
  const { data: receipts, isLoading } = useReceipts(account?.address);

  if (!account) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="neo-button bg-white p-2">
          <ScrollText className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto neo-border bg-[#FDFBF1]">
        <SheetHeader className="mb-8">
          <SheetTitle className="flex items-center gap-3 text-3xl font-black italic uppercase italic">
            <Receipt className="h-8 w-8 text-black" />
            MY RECEIPTS
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="p-12 text-center animate-pulse font-bold uppercase">
              Loading your drops...
            </div>
          )}
          {receipts && receipts.length === 0 && (
            <div className="neo-card border-dashed p-12 text-center bg-white">
              <p className="font-black uppercase text-muted-foreground/50">
                NO RECEIPTS YET
              </p>
              <p className="text-xs font-bold mt-2 uppercase">
                GRAB SOME MERCH TO SEE THEM HERE!
              </p>
            </div>
          )}
          {receipts?.map((r) => (
            <div key={r.objectId} className="neo-card bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-black uppercase leading-none">
                    {r.productName}
                  </h4>
                  <p className="text-[10px] font-black text-muted-foreground uppercase mt-1">
                    PRODUCT #{r.productId}
                  </p>
                </div>
                <Badge className="neo-border bg-primary text-black font-black px-3 py-1">
                  {formatSui(r.pricePaid)} SUI
                </Badge>
              </div>
              <div className="pt-2 border-t border-black/5">
                <p className="font-mono text-[9px] text-muted-foreground break-all uppercase">
                  OBJECT ID: <br /> {r.objectId}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <button className="w-full neo-button bg-black text-white font-black py-4 flex items-center justify-center gap-2">
            VIEW ALL ON EXPLORER <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReceiptsPanel;
