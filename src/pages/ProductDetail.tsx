import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useProductObjects } from "@/hooks/use-store-data";
import CheckoutDialog from "@/components/CheckoutDialog";
import WalletConnect from "@/components/WalletConnect";
import { formatSui, walrusImageUrl } from "@/lib/sui-config";
import type { Product } from "@/types/store";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Loader2,
  Shield,
  Truck,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { data: products, isLoading } = useProductObjects();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const product = products?.find((p) => p.objectId === id);

  const imageUrl = product
    ? product.imageUrl
      ? product.imageUrl
      : product.walrusBlobId
        ? walrusImageUrl(product.walrusBlobId)
        : null
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dot-pattern flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background dot-pattern flex flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="font-display text-2xl uppercase">Product Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="neo-button bg-primary text-primary-foreground font-bold px-6 py-3 text-sm uppercase flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-background dot-pattern">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 border-b-2 border-foreground bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="neo-button bg-card p-2 flex items-center gap-2 text-sm font-bold uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="font-display text-xl sm:text-2xl tracking-wide uppercase">
            SUI MERCH
          </h1>
          <div className="flex items-center gap-2">
            <WalletConnect />
            <button className="neo-button p-2 bg-card flex-shrink-0">
              <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Product Content */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Image */}
          <div className="neo-card bg-card overflow-hidden">
            <div className="aspect-square bg-muted relative">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60";
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/40 font-bold text-lg uppercase">
                  No Product Image
                </div>
              )}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                <Badge
                  className={`neo-border neo-shadow-sm px-3 py-1 text-xs font-bold rounded-full ${
                    inStock
                      ? "bg-success text-primary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {inStock ? `${product.stock} in stock` : "SOLD OUT"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5 sm:gap-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Product #{product.productId}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-primary font-display text-3xl sm:text-4xl">
              ${formatSui(product.price)}
            </p>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Official <strong>{product.name}</strong> from the SuiMerch blockchain huddle.
              Each purchase mints a unique Receipt NFT as your proof of ownership.
              Powered by Sui Move smart contracts with Walrus decentralized storage.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="neo-card bg-card p-3 sm:p-4 text-center">
                <Shield className="h-5 w-5 mx-auto mb-1 text-accent" />
                <p className="text-[10px] font-bold uppercase">On-Chain Verified</p>
              </div>
              <div className="neo-card bg-card p-3 sm:p-4 text-center">
                <Sparkles className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] font-bold uppercase">Receipt NFT</p>
              </div>
              <div className="neo-card bg-card p-3 sm:p-4 text-center">
                <Truck className="h-5 w-5 mx-auto mb-1 text-success" />
                <p className="text-[10px] font-bold uppercase">Delivery Option</p>
              </div>
            </div>

            {/* Object Info */}
            <div className="neo-card bg-muted/50 p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Object ID</p>
              <p className="font-mono text-xs break-all">{product.objectId}</p>
              {product.walrusBlobId && (
                <>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mt-2">Walrus Blob ID</p>
                  <p className="font-mono text-xs break-all">{product.walrusBlobId}</p>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              {account ? (
                <button
                  onClick={() => setSelectedProduct(product)}
                  disabled={!inStock}
                  className="neo-button bg-primary text-primary-foreground font-bold px-8 py-4 text-base uppercase flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inStock ? (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Buy Now — {formatSui(product.price)} SUI
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5" />
                      Sold Out
                    </>
                  )}
                </button>
              ) : (
                <div className="neo-card bg-card p-4 text-center w-full">
                  <p className="font-bold text-sm uppercase mb-3">Connect wallet to purchase</p>
                  <WalletConnect />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductDetail;
