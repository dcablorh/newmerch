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
    <div className="neo-card group">
      <div className="relative aspect-square overflow-hidden border-b-2 border-black bg-[#F5F5F5]">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60";
          }}
        />
        <div className="absolute left-3 top-3">
          <Badge
            className={`neo-border neo-shadow-sm px-3 py-1 text-xs font-bold rounded-full ${
              inStock ? "bg-primary text-black" : "bg-destructive text-white"
            }`}
          >
            {inStock ? `${product.stock} LEFT` : "SOLD OUT"}
          </Badge>
        </div>
      </div>
      <div className="p-4 space-y-3 bg-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold uppercase leading-tight">
              {product.name}
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">
              Product #{product.productId}
            </p>
          </div>
          <p className="text-lg font-black">{formatSui(product.price)} SUI</p>
        </div>

        <Button
          onClick={() => onPurchase(product)}
          disabled={!inStock}
          className="w-full neo-button bg-primary hover:bg-primary/90 text-black font-extrabold gap-2 uppercase text-xs h-10"
        >
          {inStock ? (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Bag
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              Sold Out
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
