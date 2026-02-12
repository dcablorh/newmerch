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

  return (
    <div className="min-h-screen bg-[#FDFBF1] font-sans selection:bg-primary/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b-2 border-black bg-[#FDFBF1]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
              <span className="bg-black text-white px-2 py-0.5 rounded italic">
                SUI
              </span>
              <span>MERCH</span>
            </h1>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-black hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              {account && <ReceiptsPanel />}
              {account && isAdmin && <AdminPanel />}
              <WalletConnect />
            </div>
            <button className="neo-button p-2 bg-white">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="md:hidden neo-button p-2 bg-white">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="neo-card bg-[#5BC5F2] p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col justify-center items-start">
          <div className="relative z-10 w-full md:w-1/2 space-y-6">
            <h2 className="text-6xl md:text-8xl font-black italic leading-[0.9] text-black">
              SUI <br /> MERCH
            </h2>
            <div className="flex gap-4 pt-4">
              <button className="neo-button bg-white text-black font-black px-8 py-3 rounded-2xl flex items-center gap-2">
                ADULTS <ArrowRight className="w-4 h-4" />
              </button>
              <button className="neo-button bg-white text-black font-black px-8 py-3 rounded-2xl">
                KIDS
              </button>
            </div>
          </div>

          {/* Hero Image / Illustration Placeholder */}
          <div className="absolute right-0 bottom-0 md:top-1/2 md:-translate-y-1/2 w-full md:w-1/2 h-full flex items-center justify-center p-8 pointer-events-none">
            <div className="relative w-full aspect-square max-w-[500px]">
              {/* This represents the character area from the image */}
              <img
                src="https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&auto=format&fit=crop"
                alt="Sui Characters"
                className="w-full h-full object-contain drop-shadow-[20px_20px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Header */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
          <h2 className="text-3xl font-black italic">SHOP THE LOOK</h2>
          <button className="text-xs font-black underline underline-offset-4 hover:text-primary">
            VIEW ALL PRODUCTS
          </button>
        </div>

        {/* Loading / Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.objectId}
                product={product}
                onPurchase={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="neo-card border-dashed p-20 text-center bg-white">
            <Store className="mx-auto mb-6 h-16 w-16 text-muted-foreground/30" />
            <h3 className="text-2xl font-black mb-2">NO PRODUCTS IN STORE</h3>
            <p className="font-bold text-muted-foreground max-w-md mx-auto">
              {account
                ? "Open the Admin Panel to populate your store with exclusive SUI merch!"
                : "Connect your wallet to browse and purchase amazing on-chain products."}
            </p>
          </div>
        )}
      </section>

      {/* Featured Banner - "LIL SUIHOODIES" */}
      <section className="container mx-auto px-4 py-12">
        <div className="neo-card bg-[#88B0FF] p-12 md:p-24 text-center space-y-6 relative overflow-hidden group hover:scale-[1.01] transition-transform">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 pointer-events-none" />
          <h2 className="text-5xl md:text-8xl font-black italic text-white drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] group-hover:drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all">
            LIL SUIHOODIES
          </h2>
          <p className="text-black font-black text-lg md:text-xl max-w-2xl mx-auto">
            THE MOST EXCLUSIVE COLLECTION FOR THE NEXT GENERATION OF SUI
            BUILDERS.
          </p>
          <div className="pt-4">
            <button className="neo-button bg-white text-black font-black px-12 py-4 text-xl">
              COLLECT NOW
            </button>
          </div>
        </div>
      </section>

      {/* Join Section / Footer */}
      <section className="container mx-auto px-4 py-12 mb-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="neo-card bg-[#FF91C2] p-12 flex flex-col justify-center space-y-6">
            <h2 className="text-4xl font-black italic">
              JOIN THE <br /> HUDDLE
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="YOUR EMAIL HERE"
                className="flex-1 neo-border p-4 rounded-xl font-bold placeholder:text-black/30"
              />
              <button className="neo-button bg-black text-white p-4">
                <ArrowRight />
              </button>
            </div>
            <p className="text-xs font-bold uppercase">
              BE THE FIRST TO KNOW ABOUT LATEST DROPS.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="neo-card bg-white p-8 flex flex-col justify-center items-center text-center space-y-4">
              <Twitter className="w-10 h-10 fill-current" />
              <p className="font-black italic">TWITTER</p>
            </div>
            <div className="neo-card bg-white p-8 flex flex-col justify-center items-center text-center space-y-4">
              <Instagram className="w-10 h-10" />
              <p className="font-black italic">INSTAGRAM</p>
            </div>
            <div className="neo-card bg-white p-8 flex flex-col justify-center items-center text-center space-y-4 col-span-2">
              <MessageSquare className="w-10 h-10" />
              <p className="font-black italic">DISCORD COMMUNITY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer Links */}
      <footer className="border-t-2 border-black bg-white mt-12 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-black italic text-xl">SUI MERCH © 2024</p>
          <div className="flex gap-8 text-xs font-black">
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
