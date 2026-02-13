import { ShoppingCart, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/store";
import { formatSui, walrusImageUrl } from "@/lib/sui-config";

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
  onClick?: () => void;
}

const ProductCard = ({ product, onPurchase, onClick }: ProductCardProps) => {
  const inStock = product.stock > 0;
  const imageUrl = product.imageUrl
    ? product.imageUrl
    : product.walrusBlobId
      ? walrusImageUrl(product.walrusBlobId)
      : "/placeholder.svg";

  return (
    <div className="neo-card group h-full flex flex-col bg-card overflow-hidden cursor-pointer" onClick={onClick}>
      <div className="relative aspect-square overflow-hidden border-b-2 border-foreground bg-muted flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60";
          }}
        />
        {!imageUrl || imageUrl === "/placeholder.svg" ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 font-bold text-sm uppercase">
            No Product Image
          </div>
        ) : null}
      </div>
      <div className="p-3 sm:p-4 space-y-2 bg-card flex flex-col flex-1">
        <h3 className="font-display text-base sm:text-lg uppercase leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] font-medium text-muted-foreground italic line-clamp-2">
          Official {product.name.toLowerCase()} from the blockchain huddle...
        </p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-primary font-bold text-base sm:text-lg">
            ${formatSui(product.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase(product);
            }}
            disabled={!inStock}
            className="neo-button bg-card text-foreground font-bold px-3 py-1.5 text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inStock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
