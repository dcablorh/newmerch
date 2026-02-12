import { useCurrentAccount } from '@mysten/dapp-kit-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReceipts } from '@/hooks/use-store-data';
import { formatSui } from '@/lib/sui-config';
import { Receipt, ScrollText } from 'lucide-react';

const ReceiptsPanel = () => {
  const account = useCurrentAccount();
  const { data: receipts, isLoading } = useReceipts(account?.address);

  if (!account) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="border-border/50">
          <ScrollText className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            My Receipts
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {isLoading && (
            <p className="text-center text-sm text-muted-foreground">Loading receipts...</p>
          )}
          {receipts && receipts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">No receipts yet. Buy something!</p>
          )}
          {receipts?.map((r) => (
            <Card key={r.objectId} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{r.productName}</h4>
                    <p className="font-mono text-xs text-muted-foreground">
                      #{r.productId}
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {formatSui(r.pricePaid)} SUI
                  </Badge>
                </div>
                <p className="mt-2 truncate font-mono text-xs text-muted-foreground">
                  {r.objectId}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ReceiptsPanel;
