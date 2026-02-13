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
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-bold uppercase hover:text-primary transition-colors whitespace-nowrap tracking-wide"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <h1 className="font-display text-xl sm:text-2xl tracking-wide uppercase absolute left-1/2 -translate-x-1/2">
            SUI MERCH
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {account && <ReceiptsPanel />}
              {account && isAdmin && <AdminPanel />}
            </div>
            <WalletConnect />
            <button className="neo-button p-2 bg-card flex-shrink-0">
              <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden neo-button p-2 bg-card flex-shrink-0"
            >
              <Menu className="w-4 sm:w-5 h-4 sm:h-5" />
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
      <section className="container mx-auto px-3 sm:px-4 pt-6 sm:pt-8">
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-center mb-4 sm:mb-6 tracking-wide uppercase">
          SUI MERCH
        </h2>
        <div className="neo-card bg-accent p-0 relative overflow-hidden min-h-[350px] sm:min-h-[450px] flex flex-col">
          {/* Hero Image */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&auto=format&fit=crop"
                alt="Sui Characters"
                className="w-full h-full object-contain drop-shadow-[8px_8px_0px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex gap-3 sm:gap-4 p-4 sm:p-6 pt-0 justify-center flex-wrap">
            <button className="neo-button bg-primary text-primary-foreground font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base flex items-center gap-2">
              SUITEES
              <span className="neo-border bg-card text-foreground text-xs px-2 py-0.5 rounded-lg font-bold">Shop Now</span>
            </button>
            <button className="neo-button bg-card text-foreground font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base flex items-center gap-2">
              TOYS & COLLECTIBLES
              <span className="neo-border bg-card text-foreground text-xs px-2 py-0.5 rounded-lg font-bold">Explore</span>
            </button>
          </div>
        </div>
      </section>

      {/* Shop The Look */}
      <section className="container mx-auto px-3 sm:px-4 py-10 sm:py-16">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-wide">
            Shop The Look
          </h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium italic">
            Check out our most popular merch gear, fresh from the ice!
          </p>
        </div>

        {/* Loading / Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.objectId}
                  product={product}
                  onPurchase={setSelectedProduct}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8 sm:mt-10">
              <button className="neo-button bg-primary text-primary-foreground font-bold px-8 py-3 text-sm uppercase tracking-wide">
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="neo-card border-dashed p-8 sm:p-16 text-center bg-card">
            <Store className="mx-auto mb-4 h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground/30" />
            <h3 className="font-display text-xl sm:text-2xl uppercase">No Products In Store</h3>
            <p className="font-medium text-muted-foreground max-w-md mx-auto text-sm mt-2">
              {account
                ? "Open the Admin Panel to populate your store with exclusive SUI merch!"
                : "Connect your wallet to browse and purchase amazing on-chain products."}
            </p>
          </div>
        )}
      </section>

      {/* Featured Banner */}
      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="neo-card bg-accent p-8 sm:p-12 md:p-16 text-center space-y-4 sm:space-y-6 relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <h2 className="font-display text-3xl sm:text-5xl md:text-7xl text-primary-foreground drop-shadow-[3px_3px_0px_rgba(0,0,0,0.5)]">
            LIL SUIHOODIES
          </h2>
          <p className="text-foreground font-bold text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Stay cozy in the huddle with our new collection of ultra-soft hoodies.
            Premium quality, maximum comfort!
          </p>
          <div className="pt-2">
            <button className="neo-button bg-card text-foreground font-bold px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base uppercase">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Join Section / Footer */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="neo-card bg-primary p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-4 sm:space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase leading-tight text-primary-foreground">
              Join The <br /> Huddle
            </h2>
            <div className="flex gap-2 flex-col xs:flex-row">
              <input
                type="text"
                placeholder="YOUR EMAIL HERE"
                className="flex-1 neo-border p-3 sm:p-4 rounded-xl font-bold placeholder:text-foreground/30 text-sm bg-card"
              />
              <button className="neo-button bg-foreground text-card p-3 sm:p-4 flex-shrink-0 rounded-xl">
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            <p className="text-xs font-bold uppercase leading-relaxed text-primary-foreground/80">
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
      <footer className="border-t-2 border-foreground bg-card py-8 sm:py-10">
        <div className="container mx-auto px-3 sm:px-4 flex flex-col gap-6 sm:gap-0 sm:flex-row justify-between items-center">
          <p className="font-display text-base sm:text-lg uppercase">SUI MERCH © 2025</p>
          <div className="flex flex-wrap gap-4 sm:gap-8 text-xs font-bold justify-center sm:justify-end uppercase">
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
