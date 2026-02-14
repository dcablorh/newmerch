import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useProductObjects } from "@/hooks/use-store-data";
import { useCart } from "@/hooks/use-cart";
import Navbar from "@/components/Navbar";
import CheckoutDialog from "@/components/CheckoutDialog";
import WalletConnect from "@/components/WalletConnect";
import { formatSui, walrusImageUrl } from "@/lib/sui-config";
import type { Product } from "@/types/store";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Loader2,
  Check,
  Home,
  Minus,
  Plus,
  CheckCircle,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { data: products, isLoading } = useProductObjects();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);

  const product = products?.find((p) => p.objectId === id);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const imageUrl = product
    ? product.imageUrl
      ? product.imageUrl
      : product.walrusBlobId
        ? walrusImageUrl(product.walrusBlobId)
        : null
    : null;

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

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
  };

  return (
    <div className="min-h-screen bg-background dot-pattern font-sans">
      <Navbar />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="neo-button p-2 sm:p-3 bg-card hover:bg-muted transition-colors w-fit flex items-center gap-2 mb-4 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-bold uppercase text-xs sm:text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 xl:gap-16">
          {/* Image */}
          <div className="neo-card bg-card overflow-hidden">
            <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-4 sm:p-6">
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
                  <Package className="h-16 sm:h-20 w-16 sm:w-20 mx-auto mb-4 opacity-30" />
                  <p className="font-display text-base sm:text-xl uppercase">No Product Image</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-black uppercase leading-[0.9] tracking-tighter">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-display text-2xl sm:text-3xl">${formatSui(product.price)}</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${
                  inStock
                    ? "border-success text-success bg-success/10"
                    : "border-destructive text-destructive bg-destructive/10"
                }`}>
                  {inStock && <Check className="h-3 w-3" />}
                  {inStock ? "In Stock" : "Sold Out"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Elegant performance merch from the Sui ecosystem. On-chain verified.
              </p>
            </div>

            {/* Size */}
            <div className="space-y-3">
              <h3 className="font-black text-sm uppercase tracking-widest italic">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center font-black text-sm transition-all neo-border rounded-lg ${
                      selectedSize === size
                        ? "bg-foreground text-card translate-y-[2px] shadow-none"
                        : "bg-card text-foreground neo-shadow-sm hover:translate-y-[-1px]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-black text-sm uppercase tracking-widest italic">Quantity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center font-black neo-border rounded-lg bg-card neo-shadow-sm hover:translate-y-[-1px] transition-all"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="h-10 w-12 sm:h-11 sm:w-14 flex items-center justify-center font-black text-lg neo-border rounded-lg bg-card">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center font-black neo-border rounded-lg bg-card neo-shadow-sm hover:translate-y-[-1px] transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              {account ? (
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full neo-button bg-primary text-primary-foreground font-black py-4 sm:py-5 text-base sm:text-lg uppercase flex items-center justify-center gap-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inStock ? (
                    <>
                      <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                      ADD TO CART
                    </>
                  ) : (
                    "SOLD OUT"
                  )}
                </button>
              ) : (
                <div className="neo-card bg-primary/10 p-4 sm:p-6 text-center border-dashed space-y-3">
                  <p className="font-black text-sm uppercase">Connect wallet to purchase</p>
                  <div className="flex justify-center">
                    <WalletConnect />
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="neo-card bg-card p-4 sm:p-5 space-y-3">
              <h3 className="font-black text-sm uppercase tracking-widest italic">Features</h3>
              <ul className="space-y-2">
                {[
                  "Premium quality materials",
                  "Limited edition design",
                  "On-chain receipt NFT included",
                  "Verified on Sui blockchain",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] sm:text-xs text-muted-foreground space-y-1 pt-2">
              <p className="font-bold uppercase tracking-widest">Product #{product.productId} · Stock: {product.stock}</p>
              <p className="font-mono break-all opacity-60">{product.objectId}</p>
            </div>
          </div>
        </div>
      </div>

      <CheckoutDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default ProductDetail;
