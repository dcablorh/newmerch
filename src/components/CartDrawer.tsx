import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatSui, walrusImageUrl } from "@/lib/sui-config";
import { useState } from "react";
import CheckoutDialog from "@/components/CheckoutDialog";
import type { Product } from "@/types/store";

const CartDrawer = () => {
  const { items, totalItems, updateQuantity, removeFromCart } = useCart();
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button className="neo-button p-1.5 sm:p-2 bg-card flex-shrink-0 relative">
            <ShoppingBag className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center neo-border">
                {totalItems}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md bg-card border-l-2 border-foreground p-0 flex flex-col z-[100]">
          <SheetHeader className="p-4 border-b-2 border-foreground">
            <SheetTitle className="font-display text-xl uppercase">Your Cart ({totalItems})</SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
              <p className="font-bold text-sm text-muted-foreground uppercase">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => {
                const imgUrl = item.product.imageUrl
                  ? item.product.imageUrl
                  : item.product.walrusBlobId
                    ? walrusImageUrl(item.product.walrusBlobId)
                    : "/placeholder.svg";

                return (
                  <div
                    key={`${item.product.objectId}-${item.size}`}
                    className="neo-card bg-background p-3 flex gap-3"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden neo-border flex-shrink-0 bg-muted">
                      <img src={imgUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm uppercase truncate">{item.product.name}</h4>
                        {item.size && (
                          <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                        )}
                        <p className="text-primary font-bold text-sm">${formatSui(item.product.price)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product.objectId, item.quantity - 1, item.size)}
                            className="w-6 h-6 flex items-center justify-center neo-border rounded bg-card text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 h-6 flex items-center justify-center font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.objectId, item.quantity + 1, item.size)}
                            className="w-6 h-6 flex items-center justify-center neo-border rounded bg-card text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.objectId, item.size)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {items.length > 0 && (
            <div className="border-t-2 border-foreground p-4 space-y-3">
              <div className="flex justify-between font-bold text-sm uppercase">
                <span>Total</span>
                <span className="text-primary">
                  ${formatSui(items.reduce((sum, i) => sum + i.product.price * i.quantity, 0))}
                </span>
              </div>
              <button
                onClick={() => {
                  if (items.length > 0) setCheckoutProduct(items[0].product);
                }}
                className="w-full neo-button bg-primary text-primary-foreground font-bold py-3 text-sm uppercase"
              >
                Checkout
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        product={checkoutProduct}
        open={!!checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
      />
    </>
  );
};

export default CartDrawer;
