import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/store";
import { formatSui, walrusImageUrl } from "@/lib/sui-config";

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
}

const ProductCard = ({ product, onPurchase }: ProductCardProps) => {
  const inStock = product.stock > 0;
  const imageUrl = product.imageUrl
    ? product.imageUrl
    : product.walrusBlobId
      ? walrusImageUrl(product.walrusBlobId)
      : "/placeholder.svg";

  return (
    <div className="neo-card group h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden border-b-2 border-black bg-[#F5F5F5] flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60";
          }}
        />
        <div className="absolute left-2 sm:left-3 top-2 sm:top-3">
          <Badge
            className={`neo-border neo-shadow-sm px-2 sm:px-3 py-1 text-xs font-bold rounded-full ${
              inStock ? "bg-primary text-black" : "bg-destructive text-white"
            }`}
          >
            {inStock ? `${product.stock} LEFT` : "SOLD OUT"}
          </Badge>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-white flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 min-h-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold uppercase leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mt-0.5 truncate">
              Product #{product.productId}
            </p>
          </div>
          <p className="text-base sm:text-lg font-black flex-shrink-0 whitespace-nowrap">{formatSui(product.price)} SUI</p>
        </div>

        <Button
          onClick={() => onPurchase(product)}
          disabled={!inStock}
          className="w-full neo-button bg-primary hover:bg-primary/90 text-black font-extrabold gap-2 uppercase text-xs sm:text-sm h-9 sm:h-10 mt-auto"
        >
          {inStock ? (
            <>
              <ShoppingCart className="h-3 sm:h-4 w-3 sm:w-4" />
              <span className="hidden xs:inline">Add to Bag</span>
              <span className="xs:hidden">Add</span>
            </>
          ) : (
            <>
              <Package className="h-3 sm:h-4 w-3 sm:w-4" />
              <span className="hidden xs:inline">Sold Out</span>
              <span className="xs:hidden">Out</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
