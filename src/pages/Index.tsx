import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import WalletConnect from "@/components/WalletConnect";
import ProductCard from "@/components/ProductCard";
import CheckoutDialog from "@/components/CheckoutDialog";
import AdminPanel from "@/components/AdminPanel";
import ReceiptsPanel from "@/components/ReceiptsPanel";
import { useProductObjects } from "@/hooks/use-store-data";
import { useIsAdmin } from "@/hooks/use-admin-store";
import type { Product } from "@/types/store";
import headerImage from "@/assets/sui-merch-header.png";
import {
  Store,
  Loader2,
  ShoppingBag,
  Menu,
  ArrowRight,
  Instagram,
  Twitter,
  MessageSquare,
} from "lucide-react";

const Index = () => {
  const account = useCurrentAccount();
  const { isAdmin } = useIsAdmin();
  const { data: products, isLoading } = useProductObjects();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = ["THE HUB", "SUILORE", "BUY SUI"];

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.objectId}`);
  };

  return (
    <div className="min-h-screen bg-background dot-pattern font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b-2 border-foreground bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-8 flex-1">
            <h1 className="font-display text-lg xs:text-xl sm:text-2xl tracking-wide uppercase whitespace-nowrap">
              SUI MERCH
            </h1>
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[10px] xl:text-xs font-bold uppercase hover:text-primary transition-colors whitespace-nowrap tracking-widest"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 justify-end">
            <div className="hidden sm:flex items-center gap-2">
              {account && <ReceiptsPanel />}
              {account && isAdmin && <AdminPanel />}
            </div>
            <div className="scale-[0.8] xs:scale-90 sm:scale-100 origin-right">
              <WalletConnect />
            </div>
            <button className="neo-button p-1.5 xs:p-2 bg-card flex-shrink-0">
              <ShoppingBag className="w-3.5 xs:w-4 h-3.5 xs:h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden neo-button p-1.5 xs:p-2 bg-card flex-shrink-0"
            >
              <Menu className="w-3.5 xs:w-4 h-3.5 xs:h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-foreground bg-card">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-bold hover:text-primary transition-colors py-2 uppercase"
                >
                  {link}
                </a>
              ))}
              <div className="pt-3 border-t border-foreground/10 flex flex-col gap-2 sm:hidden">
                {account && (
                  <>
                    <ReceiptsPanel />
                    {isAdmin && <AdminPanel />}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-2 xs:px-3 sm:px-4 pt-3 xs:pt-4 sm:pt-6 md:pt-8">
        <div className="neo-card bg-accent p-0 relative overflow-hidden flex flex-col md:flex-row items-center">
          {/* Hero Image Container - Adapted for square characters image */}
          <div className="flex items-center justify-center w-full md:w-1/2 bg-card/10 border-b-2 md:border-b-0 md:border-r-2 border-foreground overflow-hidden">
            <img
              src={headerImage}
              alt="SUI MERCH Characters"
              className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain p-2 hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-4 xs:p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-primary-foreground drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                JOIN THE <br className="hidden sm:block" /> HUDDLE
              </h2>
              <p className="text-foreground dark:text-foreground font-bold text-[10px] xs:text-xs sm:text-sm md:text-base max-w-sm mx-auto leading-tight sm:leading-relaxed">
                Experience the first wave of Sui-powered collectibles and gear. 
                Premium quality, fully on-chain receipts.
              </p>
            </div>

            {/* Category Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 w-full max-w-xs xs:max-w-none justify-center">
              <button className="neo-button bg-primary text-primary-foreground font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">
                SHOP SUITEES
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button className="neo-button bg-card text-foreground font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">
                COLLECTIBLES
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop The Look */}
      <section className="container mx-auto px-2 xs:px-3 sm:px-4 py-6 xs:py-8 sm:py-10 md:py-16">
        <div className="text-center mb-4 xs:mb-6 sm:mb-8 md:mb-10">
          <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide">
            Shop The Look
          </h2>
          <p className="text-xs xs:text-sm text-muted-foreground mt-1.5 xs:mt-2 font-medium italic">
            Check out our most popular merch gear, fresh from the ice!
          </p>
        </div>

        {/* Loading / Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 xs:py-20">
            <Loader2 className="h-10 xs:h-12 w-10 xs:w-12 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid gap-2 xs:gap-3 sm:gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  key={product.objectId}
                  product={product}
                  onPurchase={setSelectedProduct}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
            <div className="flex justify-center mt-6 xs:mt-8 sm:mt-10">
              <button className="neo-button bg-primary text-primary-foreground font-bold px-6 xs:px-8 sm:px-8 md:px-12 py-2.5 xs:py-3 sm:py-3 md:py-4 text-xs xs:text-sm sm:text-base uppercase tracking-wide">
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="neo-card border-dashed p-6 xs:p-8 sm:p-12 md:p-16 text-center bg-card">
            <Store className="mx-auto mb-2 xs:mb-3 sm:mb-4 h-10 xs:h-12 sm:h-16 w-10 xs:w-12 sm:w-16 text-muted-foreground/30" />
            <h3 className="font-display text-lg xs:text-xl sm:text-2xl uppercase">No Products In Store</h3>
            <p className="font-medium text-muted-foreground max-w-md mx-auto text-xs xs:text-sm mt-1 xs:mt-2">
              {account
                ? "Open the Admin Panel to populate your store with exclusive SUI merch!"
                : "Connect your wallet to browse and purchase amazing on-chain products."}
            </p>
          </div>
        )}
      </section>

      {/* Featured Banner */}
      <section className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6 sm:py-8 md:py-10">
        <div className="neo-card bg-accent p-6 xs:p-8 sm:p-12 md:p-16 text-center space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6 relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <h2 className="font-display text-2xl xs:text-3xl sm:text-5xl md:text-7xl text-primary-foreground drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)]">
            LIL SUIHOODIES
          </h2>
          <p className="text-foreground font-bold text-[10px] xs:text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Stay cozy in the huddle with our new collection of ultra-soft hoodies.
            Premium quality, maximum comfort!
          </p>
          <div className="pt-1 xs:pt-2">
            <button className="neo-button bg-card text-foreground font-bold px-6 xs:px-8 sm:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 text-xs xs:text-sm sm:text-base uppercase">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Join Section / Footer */}
      <section className="container mx-auto px-2 xs:px-3 sm:px-4 py-6 xs:py-8 sm:py-12 mb-8 xs:mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
          <div className="neo-card bg-primary p-4 xs:p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-3 xs:space-y-4 sm:space-y-6">
            <h2 className="font-display text-xl xs:text-2xl sm:text-3xl md:text-4xl uppercase leading-tight text-primary-foreground">
              Join The <br /> Huddle
            </h2>
            <div className="flex gap-1.5 xs:gap-2 flex-col xs:flex-row">
              <input
                type="text"
                placeholder="YOUR EMAIL HERE"
                className="flex-1 neo-border p-2 xs:p-3 sm:p-4 rounded-xl font-bold placeholder:text-foreground/30 text-xs xs:text-sm bg-card"
              />
              <button className="neo-button bg-foreground text-card p-2 xs:p-3 sm:p-4 flex-shrink-0 rounded-xl">
                <ArrowRight className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5" />
              </button>
            </div>
            <p className="text-[9px] xs:text-xs sm:text-sm font-bold uppercase leading-relaxed text-primary-foreground/80">
              Be the first to know about latest drops.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
            <div className="neo-card bg-card p-3 xs:p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-1.5 xs:space-y-2 cursor-pointer hover:translate-y-[-2px] transition-transform">
              <Twitter className="w-5 xs:w-6 sm:w-8 h-5 xs:h-6 sm:h-8 fill-current" />
              <p className="font-display text-[9px] xs:text-xs sm:text-sm uppercase">Twitter</p>
            </div>
            <div className="neo-card bg-card p-3 xs:p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-1.5 xs:space-y-2 cursor-pointer hover:translate-y-[-2px] transition-transform">
              <Instagram className="w-5 xs:w-6 sm:w-8 h-5 xs:h-6 sm:h-8" />
              <p className="font-display text-[9px] xs:text-xs sm:text-sm uppercase">Instagram</p>
            </div>
            <div className="neo-card bg-card p-3 xs:p-4 sm:p-6 flex flex-col justify-center items-center text-center space-y-1.5 xs:space-y-2 col-span-2 cursor-pointer hover:translate-y-[-2px] transition-transform">
              <MessageSquare className="w-5 xs:w-6 sm:w-8 h-5 xs:h-6 sm:h-8" />
              <p className="font-display text-[9px] xs:text-xs sm:text-sm uppercase">Discord Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground bg-card py-6 xs:py-8 sm:py-10">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 flex flex-col gap-4 xs:gap-5 sm:gap-0 sm:flex-row justify-between items-center">
          <p className="font-display text-sm xs:text-base sm:text-lg uppercase">SUI MERCH © 2025</p>
          <div className="flex flex-wrap gap-3 xs:gap-4 sm:gap-8 text-[9px] xs:text-xs font-bold justify-center sm:justify-end uppercase">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Checkout Dialog */}
      <CheckoutDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Index;
