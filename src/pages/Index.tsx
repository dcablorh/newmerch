import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CheckoutDialog from "@/components/CheckoutDialog";
import { useProductObjects } from "@/hooks/use-store-data";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/store";
import headerImage from "@/assets/sui-merch-header.png";
import {
  Store,
  Loader2,
  ArrowRight,
  Instagram,
  Twitter,
  MessageSquare,
} from "lucide-react";

const Index = () => {
  const account = useCurrentAccount();
  const { data: products, isLoading } = useProductObjects();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.objectId}`);
  };

  return (
    <div className="min-h-screen bg-background dot-pattern font-sans selection:bg-primary/30">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6 md:pt-8">
        <div className="neo-card bg-accent p-0 relative overflow-hidden flex flex-col md:flex-row items-center">
          <div className="flex items-center justify-center w-full md:w-1/2 bg-card/10 border-b-2 md:border-b-0 md:border-r-2 border-foreground overflow-hidden">
            <img
              src={headerImage}
              alt="SUI MERCH Characters"
              className="w-full h-auto max-h-[250px] sm:max-h-[350px] md:max-h-[450px] object-contain p-2 hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-10 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-primary-foreground drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                JOIN THE <br className="hidden sm:block" /> HUDDLE
              </h2>
              <p className="text-foreground font-bold text-xs sm:text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                Experience the first wave of Sui-powered collectibles and gear.
                Premium quality, fully on-chain receipts.
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 w-full max-w-xs xs:max-w-none justify-center">
              <button
                onClick={() => navigate("/shop")}
                className="neo-button bg-primary text-primary-foreground font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                SHOP SUITEES <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate("/shop")}
                className="neo-button bg-card text-foreground font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                COLLECTIBLES <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop The Look */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl uppercase tracking-wide">
            Shop The Look
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium italic">
            Check out our most popular merch gear, fresh from the ice!
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  key={product.objectId}
                  product={product}
                  onPurchase={(p) => addToCart(p)}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8 sm:mt-10">
              <button
                onClick={() => navigate("/shop")}
                className="neo-button bg-primary text-primary-foreground font-bold px-8 sm:px-12 py-3 sm:py-4 text-xs sm:text-base uppercase tracking-wide"
              >
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="neo-card border-dashed p-8 sm:p-12 md:p-16 text-center bg-card">
            <Store className="mx-auto mb-3 sm:mb-4 h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground/30" />
            <h3 className="font-display text-lg sm:text-2xl uppercase">No Products In Store</h3>
            <p className="font-medium text-muted-foreground max-w-md mx-auto text-xs sm:text-sm mt-2">
              {account
                ? "Open the Admin Panel to populate your store with exclusive SUI merch!"
                : "Connect your wallet to browse and purchase amazing on-chain products."}
            </p>
          </div>
        )}
      </section>

      {/* Featured Banner */}
      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10">
        <div className="neo-card bg-accent p-6 sm:p-10 md:p-16 text-center space-y-3 sm:space-y-6 relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <h2 className="font-display text-2xl sm:text-5xl md:text-7xl text-primary-foreground drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)]">
            LIL SUIHOODIES
          </h2>
          <p className="text-foreground font-bold text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Stay cozy in the huddle with our new collection of ultra-soft hoodies.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/shop")}
              className="neo-button bg-card text-foreground font-bold px-8 sm:px-12 py-2.5 sm:py-4 text-xs sm:text-base uppercase"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 mb-8 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div className="neo-card bg-primary p-5 sm:p-8 md:p-10 flex flex-col justify-center space-y-4 sm:space-y-6">
            <h2 className="font-display text-xl sm:text-3xl md:text-4xl uppercase leading-tight text-primary-foreground">
              Join The <br /> Huddle
            </h2>
            <div className="flex gap-2 flex-col xs:flex-row">
              <input
                type="text"
                placeholder="YOUR EMAIL HERE"
                className="flex-1 neo-border p-3 sm:p-4 rounded-xl font-bold placeholder:text-foreground/30 text-xs sm:text-sm bg-card"
              />
              <button className="neo-button bg-foreground text-card p-3 sm:p-4 flex-shrink-0 rounded-xl">
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase leading-relaxed text-primary-foreground/80">
              Be the first to know about latest drops.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="neo-card bg-card p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-2 cursor-pointer hover:translate-y-[-2px] transition-transform">
              <Twitter className="w-6 sm:w-8 h-6 sm:h-8 fill-current" />
              <p className="font-display text-xs sm:text-sm uppercase">Twitter</p>
            </div>
            <div className="neo-card bg-card p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-2 cursor-pointer hover:translate-y-[-2px] transition-transform">
              <Instagram className="w-6 sm:w-8 h-6 sm:h-8" />
              <p className="font-display text-xs sm:text-sm uppercase">Instagram</p>
            </div>
            <div className="neo-card bg-card p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-2 col-span-2 cursor-pointer hover:translate-y-[-2px] transition-transform">
              <MessageSquare className="w-6 sm:w-8 h-6 sm:h-8" />
              <p className="font-display text-xs sm:text-sm uppercase">Discord Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground bg-card py-6 sm:py-10">
        <div className="container mx-auto px-3 sm:px-4 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between items-center">
          <p className="font-display text-sm sm:text-lg uppercase">SUI MERCH © 2025</p>
          <div className="flex flex-wrap gap-4 sm:gap-8 text-xs font-bold justify-center sm:justify-end uppercase">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <CheckoutDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Index;
