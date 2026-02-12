import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/store';
import { formatSui, walrusImageUrl } from '@/lib/sui-config';

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
}

const ProductCard = ({ product, onPurchase }: ProductCardProps) => {
  const inStock = product.stock > 0;
  const imageUrl = product.walrusBlobId
    ? walrusImageUrl(product.walrusBlobId)
    : '/placeholder.svg';

  return (
    <Card className="card-hover overflow-hidden border-border/50 bg-card">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <Badge
          className={`absolute right-3 top-3 ${
            inStock
              ? 'bg-success/90 text-primary-foreground'
              : 'bg-destructive/90 text-destructive-foreground'
          }`}
        >
          {inStock ? `${product.stock} left` : 'Sold out'}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="mb-1 text-lg font-semibold text-foreground">{product.name}</h3>
        <p className="mb-1 font-mono text-xs text-muted-foreground">
          ID: #{product.productId}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="gradient-text text-xl font-bold">
            {formatSui(product.price)} SUI
          </span>
          <Button
            size="sm"
            onClick={() => onPurchase(product)}
            disabled={!inStock}
            className="gap-2"
          >
            {inStock ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                Buy
              </>
            ) : (
              <>
                <Package className="h-4 w-4" />
                Sold Out
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
