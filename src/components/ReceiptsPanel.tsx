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
        <button className="neo-button bg-white p-2 flex-shrink-0">
          <ScrollText className="h-4 sm:h-5 w-4 sm:w-5" />
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto neo-border bg-[#FDFBF1] w-[95vw] sm:w-auto">
        <SheetHeader className="mb-6 sm:mb-8">
          <SheetTitle className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl font-black italic uppercase leading-tight">
            <Receipt className="h-6 sm:h-8 w-6 sm:w-8 text-black flex-shrink-0" />
            MY RECEIPTS
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3 sm:space-y-4">
          {isLoading && (
            <div className="p-8 sm:p-12 text-center animate-pulse font-bold uppercase text-xs sm:text-base">
              Loading your drops...
            </div>
          )}
          {receipts && receipts.length === 0 && (
            <div className="neo-card border-dashed p-8 sm:p-12 text-center bg-white">
              <p className="font-black uppercase text-muted-foreground/50 text-sm sm:text-base">
                NO RECEIPTS YET
              </p>
              <p className="text-xs font-bold mt-2 uppercase">
                GRAB SOME MERCH TO SEE THEM HERE!
              </p>
            </div>
          )}
          {receipts?.map((r) => (
            <div key={r.objectId} className="neo-card bg-white p-3 sm:p-5 space-y-2 sm:space-y-3">
              <div className="flex items-start justify-between gap-2 min-h-0">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-black uppercase leading-none line-clamp-2">
                    {r.productName}
                  </h4>
                  <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase mt-1">
                    PRODUCT #{r.productId}
                  </p>
                </div>
                <Badge className="neo-border bg-primary text-black font-black px-2 sm:px-3 py-1 text-xs sm:text-sm flex-shrink-0 whitespace-nowrap">
                  {formatSui(r.pricePaid)} SUI
                </Badge>
              </div>
              <div className="pt-2 border-t border-black/5">
                <p className="font-mono text-[7px] sm:text-[9px] text-muted-foreground break-all uppercase">
                  OBJECT ID: <br /> {r.objectId}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12">
          <button className="w-full neo-button bg-black text-white font-black py-3 sm:py-4 flex items-center justify-center gap-2 text-xs sm:text-base">
            VIEW ALL ON EXPLORER <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReceiptsPanel;
