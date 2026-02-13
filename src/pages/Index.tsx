import { useState } from "react";
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
import { Button } from "@/components/ui/button";

const Index = () => {
  const account = useCurrentAccount();
  const { isAdmin } = useIsAdmin();
  const { data: products, isLoading } = useProductObjects();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const navLinks = ["THE HUB", "COLLECTIONS", "SHOP", "ABOUT"];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFBF1] font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b-2 border-black bg-[#FDFBF1]/80 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-8 min-w-0">
            <h1 className="text-lg sm:text-2xl font-black italic tracking-tighter flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className="bg-black text-white px-1.5 sm:px-2 py-0.5 rounded italic text-xs sm:text-base">
                SUI
              </span>
              <span className="hidden xs:inline">MERCH</span>
            </h1>
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-black hover:text-primary transition-colors whitespace-nowrap"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              {account && <ReceiptsPanel />}
              {account && isAdmin && <AdminPanel />}
              <WalletConnect />
            </div>
            <button className="neo-button p-2 bg-white flex-shrink-0">
              <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden neo-button p-2 bg-white flex-shrink-0"
            >
              <Menu className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-black bg-white">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-black hover:text-primary transition-colors py-2"
                >
                  {link}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2 sm:hidden">
                {account && (
                  <>
                    <div className="text-xs font-bold text-gray-600 py-2">ACCOUNT</div>
                    <ReceiptsPanel />
                    {isAdmin && <AdminPanel />}
                  </>
                )}
                <WalletConnect />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="neo-card bg-[#5BC5F2] p-4 sm:p-8 md:p-12 relative overflow-hidden min-h-[400px] sm:min-h-[500px] flex flex-col justify-center items-start">
          <div className="relative z-10 w-full lg:w-1/2 space-y-3 sm:space-y-6">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic leading-[0.9] text-black">
              SUI <br className="hidden xs:block" /> MERCH
            </h2>
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
              <button className="neo-button bg-white text-black font-black px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-base flex-1 xs:flex-none whitespace-nowrap">
                ADULTS <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button className="neo-button bg-white text-black font-black px-4 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-base flex-1 xs:flex-none">
                KIDS
              </button>
            </div>
          </div>

          {/* Hero Image / Illustration Placeholder */}
          <div className="absolute right-0 bottom-0 lg:top-1/2 lg:-translate-y-1/2 w-1/2 lg:w-1/2 h-full flex items-center justify-center p-2 sm:p-4 lg:p-8 pointer-events-none">
            <div className="relative w-full aspect-square max-w-[300px] sm:max-w-[400px] md:max-w-[500px]">
              <img
                src="https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&auto=format&fit=crop"
                alt="Sui Characters"
                className="w-full h-full object-contain drop-shadow-[10px_10px_0px_rgba(0,0,0,0.8)] sm:drop-shadow-[20px_20px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Header */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 mb-6 sm:mb-8 border-b-2 border-black pb-3 sm:pb-4">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black italic">SHOP THE LOOK</h2>
          <button className="text-xs font-black underline underline-offset-4 hover:text-primary transition-colors whitespace-nowrap">
            VIEW ALL PRODUCTS
          </button>
        </div>

        {/* Loading / Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.objectId}
                product={product}
                onPurchase={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="neo-card border-dashed p-8 sm:p-12 md:p-20 text-center bg-white">
            <Store className="mx-auto mb-4 sm:mb-6 h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground/30" />
            <h3 className="text-xl sm:text-2xl font-black mb-2">NO PRODUCTS IN STORE</h3>
            <p className="font-bold text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
              {account
                ? "Open the Admin Panel to populate your store with exclusive SUI merch!"
                : "Connect your wallet to browse and purchase amazing on-chain products."}
            </p>
          </div>
        )}
      </section>

      {/* Featured Banner - "LIL SUIHOODIES" */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="neo-card bg-[#88B0FF] p-6 sm:p-12 md:p-16 lg:p-24 text-center space-y-4 sm:space-y-6 relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none" />
          <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black italic text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,0.7)] sm:drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] group-hover:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)] sm:group-hover:drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all">
            LIL SUIHOODIES
          </h2>
          <p className="text-black font-black text-xs sm:text-sm md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            THE MOST EXCLUSIVE COLLECTION FOR THE NEXT GENERATION OF SUI
            BUILDERS.
          </p>
          <div className="pt-2 sm:pt-4">
            <button className="neo-button bg-white text-black font-black px-6 sm:px-12 py-2 sm:py-4 text-xs sm:text-base md:text-lg rounded-xl sm:rounded-2xl whitespace-nowrap">
              COLLECT NOW
            </button>
          </div>
        </div>
      </section>

      {/* Join Section / Footer */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 mb-16 sm:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          <div className="neo-card bg-[#FF91C2] p-6 sm:p-8 md:p-12 flex flex-col justify-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic leading-tight">
              JOIN THE <br /> HUDDLE
            </h2>
            <div className="flex gap-2 flex-col xs:flex-row">
              <input
                type="text"
                placeholder="YOUR EMAIL HERE"
                className="flex-1 neo-border p-3 sm:p-4 rounded-lg sm:rounded-xl font-bold placeholder:text-black/30 text-sm sm:text-base"
              />
              <button className="neo-button bg-black text-white p-3 sm:p-4 flex-shrink-0 rounded-lg sm:rounded-xl">
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            <p className="text-xs font-bold uppercase leading-relaxed">
              BE THE FIRST TO KNOW ABOUT LATEST DROPS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="neo-card bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center space-y-2 sm:space-y-4 cursor-pointer hover:scale-105 transition-transform">
              <Twitter className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 fill-current" />
              <p className="font-black italic text-xs sm:text-base">TWITTER</p>
            </div>
            <div className="neo-card bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center space-y-2 sm:space-y-4 cursor-pointer hover:scale-105 transition-transform">
              <Instagram className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10" />
              <p className="font-black italic text-xs sm:text-base">INSTAGRAM</p>
            </div>
            <div className="neo-card bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center space-y-2 sm:space-y-4 col-span-2 cursor-pointer hover:scale-105 transition-transform">
              <MessageSquare className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10" />
              <p className="font-black italic text-xs sm:text-base">DISCORD COMMUNITY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer Links */}
      <footer className="border-t-2 border-black bg-white mt-8 sm:mt-12 py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4 flex flex-col gap-6 sm:gap-0 sm:flex-row justify-between items-center">
          <p className="font-black italic text-base sm:text-lg md:text-xl">SUI MERCH © 2024</p>
          <div className="flex flex-wrap gap-4 sm:gap-8 text-xs sm:text-sm font-black justify-center sm:justify-end">
            <a
              href="#"
              className="hover:text-primary transition-colors uppercase"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors uppercase"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors uppercase"
            >
              Cookies
            </a>
            <a
              href="#"
              className="hover:text-primary transition-colors uppercase"
            >
              Contact
            </a>
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
