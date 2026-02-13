import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useProductObjects } from "@/hooks/use-store-data";
import CheckoutDialog from "@/components/CheckoutDialog";
import WalletConnect from "@/components/WalletConnect";
import { formatSui, walrusImageUrl } from "@/lib/sui-config";
import suiMerchHeader from "@/assets/sui-merch-header.png";
import type { Product } from "@/types/store";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Loader2,
  Shield,
  Truck,
  Sparkles,
  Home,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { data: products, isLoading } = useProductObjects();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const product = products?.find((p) => p.objectId === id);

  const imageUrl = product
    ? product.imageUrl
      ? product.imageUrl
      : product.walrusBlobId
        ? walrusImageUrl(product.walrusBlobId)
        : null
    : null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <Package className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-2xl font-bold uppercase">Product Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="neo-button bg-primary text-primary-foreground font-bold px-6 py-3 text-sm uppercase flex items-center gap-2"
        >
          <Home className="h-4 w-4" /> Back to Store
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-b from-primary/20 to-background">
        <img
          src={suiMerchHeader}
          alt="SUI Merch"
          className="h-full w-full object-cover"
        />
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 neo-button bg-card/90 backdrop-blur p-2 hover:bg-card"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image - Left */}
          <div className="flex flex-col gap-4">
            <div className="neo-card bg-card overflow-hidden">
              <div className="aspect-square bg-muted relative flex items-center justify-center">
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
                  <div className="text-center text-muted-foreground/40">
                    <Package className="h-16 w-16 mx-auto mb-2 opacity-30" />
                    <p className="font-bold text-sm uppercase">No Image</p>
                  </div>
                )}
                {/* Stock Badge */}
                <Badge
                  className={`absolute top-4 left-4 neo-border neo-shadow-sm px-4 py-2 text-xs font-bold rounded-full ${
                    inStock
                      ? "bg-primary text-primary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                >
                  {inStock ? `${product.stock} in stock` : "SOLD OUT"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Info - Right */}
          <div className="flex flex-col gap-6">
            {/* Title & Price */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Product #{product.productId}
              </p>
              <h1 className="text-4xl md:text-5xl font-display font-bold uppercase leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl md:text-4xl font-display text-primary font-bold">
                {formatSui(product.price)} SUI
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed border-l-4 border-primary pl-4">
              Official <strong>{product.name}</strong> from the SuiMerch store.
              Each purchase mints a unique Receipt NFT as your proof of ownership.
              Powered by Sui Move smart contracts with Walrus decentralized storage.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="neo-card bg-card p-4 text-center">
                <Shield className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-[11px] font-bold uppercase">On-Chain</p>
              </div>
              <div className="neo-card bg-card p-4 text-center">
                <Sparkles className="h-5 w-5 mx-auto mb-2 text-accent" />
                <p className="text-[11px] font-bold uppercase">NFT Receipt</p>
              </div>
              <div className="neo-card bg-card p-4 text-center">
                <Truck className="h-5 w-5 mx-auto mb-2 text-success" />
                <p className="text-[11px] font-bold uppercase">Delivery</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              {account ? (
                <button
                  onClick={() => setSelectedProduct(product)}
                  disabled={!inStock}
                  className="neo-button bg-primary text-primary-foreground font-bold px-8 py-4 text-base uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inStock ? (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Buy Now
                    </>
                  ) : (
                    <>
                      <Package className="h-5 w-5" />
                      Sold Out
                    </>
                  )}
                </button>
              ) : (
                <div className="neo-card bg-card p-5 text-center space-y-3">
                  <p className="font-bold text-sm uppercase">Connect wallet to buy</p>
                  <WalletConnect />
                </div>
              )}
            </div>

            {/* On-Chain Details */}
            <div className="space-y-3 border-t border-border/50 pt-6">
              <h3 className="text-xs font-bold uppercase text-muted-foreground">
                On-Chain Info
              </h3>
              <div className="neo-card bg-muted/30 p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Object ID</p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-xs text-foreground/70 truncate">
                      {product.objectId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(product.objectId, "objectId")}
                      className="p-1 hover:bg-background/50 rounded"
                    >
                      {copiedId === "objectId" ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                {product.walrusBlobId && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Walrus Blob ID</p>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs text-foreground/70 truncate">
                        {product.walrusBlobId}
                      </code>
                      <button
                        onClick={() => copyToClipboard(product.walrusBlobId, "blobId")}
                        className="p-1 hover:bg-background/50 rounded"
                      >
                        {copiedId === "blobId" ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
