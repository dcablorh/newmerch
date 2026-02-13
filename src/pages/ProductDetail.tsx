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
  const [selectedSize, setSelectedSize] = useState<string>("M");

  const product = products?.find((p) => p.objectId === id);
  const sizes = ["S", "M", "L", "XL"];

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
    <div className="min-h-screen bg-background dot-pattern font-sans p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Navigation / Wallet Area - Below Arrow */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-12">
          <button
            onClick={() => navigate("/")}
            className="neo-button p-3 bg-card hover:bg-muted transition-colors w-fit flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold uppercase text-xs sm:text-sm">Back</span>
          </button>
          
          <div className="w-fit">
            <WalletConnect />
          </div>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16">
          {/* Left: Product Image */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="neo-card bg-card overflow-hidden border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="aspect-[4/3] sm:aspect-video lg:aspect-square bg-muted/30 relative flex items-center justify-center p-4">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain drop-shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60";
                    }}
                  />
                ) : (
                  <div className="text-center text-muted-foreground/40">
                    <Package className="h-20 w-20 mx-auto mb-4 opacity-30" />
                    <p className="font-display text-xl uppercase">No Product Image</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sm:gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-display font-black uppercase leading-[0.9] tracking-tighter">
                {product.name}
              </h1>

              {/* Badges Line */}
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="neo-border bg-[#5BC5F2] px-3 sm:px-4 py-2 flex items-center gap-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-display text-base sm:text-lg">{formatSui(product.price)} SUI</span>
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="neo-border bg-[#4ADE80] px-3 sm:px-4 py-2 flex items-center gap-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-bold text-xs sm:text-sm uppercase">{inStock ? "In Stock" : "Sold Out"}</span>
                  {inStock && <Check className="h-4 w-4" />}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card p-4 neo-border border-2 rounded-xl text-sm italic text-muted-foreground leading-relaxed">
              Experience our premium {product.name.toLowerCase()} crafted for the Sui ecosystem. 
              Each purchase includes a verified on-chain receipt stored on Walrus.
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <h3 className="font-black text-sm sm:text-base uppercase tracking-widest pl-1">
                SELECT SIZE:
              </h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center font-black text-lg transition-all border-4 ${
                      selectedSize === size
                        ? "bg-foreground text-card border-foreground translate-y-[2px] shadow-none"
                        : "bg-card text-foreground border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action */}
            <div className="pt-4">
              {account ? (
                <button
                  onClick={() => setSelectedProduct(product)}
                  disabled={!inStock}
                  className="w-full neo-button bg-foreground text-card font-black py-4 sm:py-5 text-lg sm:text-xl uppercase flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(255,107,74,0.5)] active:shadow-none hover:translate-y-[-2px]"
                >
                  {inStock ? (
                    <>
                      ADD TO CART
                      <ShoppingCart className="h-6 w-6" />
                    </>
                  ) : (
                    "SOLD OUT"
                  )}
                </button>
              ) : (
                <div className="neo-card bg-primary/10 p-6 text-center border-dashed space-y-4">
                  <p className="font-black text-sm uppercase">CONNECT WALLET TO PURCHASE</p>
                  <div className="flex justify-center">
                    <WalletConnect />
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="border-t-2 border-foreground/10 pt-6 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">
                <span>Product ID: {product.productId}</span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Secure Purchase
                </span>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg flex items-center justify-between gap-2 overflow-hidden border border-foreground/10">
                <code className="text-[10px] font-mono truncate">{product.objectId}</code>
                <button
                  onClick={() => copyToClipboard(product.objectId, "objectId")}
                  className="p-1.5 hover:bg-card rounded-md transition-colors"
                >
                  {copiedId === "objectId" ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                </button>
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
