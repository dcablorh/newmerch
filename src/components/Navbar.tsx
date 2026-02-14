import { Link } from "react-router-dom";
import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { useIsAdmin } from "@/hooks/use-admin-store";
import WalletConnect from "@/components/WalletConnect";
import AdminPanel from "@/components/AdminPanel";
import ReceiptsPanel from "@/components/ReceiptsPanel";
import CartDrawer from "@/components/CartDrawer";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const account = useCurrentAccount();
  const { isAdmin } = useIsAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-foreground bg-card/95 backdrop-blur-md">
      <div className="container mx-auto px-3 sm:px-4 h-14 md:h-16 flex items-center justify-between gap-2">
        {/* Left: Nav Links (desktop) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
          <Link to="/" className="text-[10px] lg:text-xs font-bold uppercase hover:text-primary transition-colors tracking-widest">
            Shop
          </Link>
          <Link to="/shop" className="text-[10px] lg:text-xs font-bold uppercase hover:text-primary transition-colors tracking-widest">
            All Products
          </Link>
        </div>

        {/* Center: Brand - positioned carefully to avoid overlap */}
        <Link
          to="/"
          className="font-display text-base sm:text-xl md:text-2xl lg:text-3xl tracking-wide uppercase whitespace-nowrap md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          SUI MERCH
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-shrink-0">
          {account && isAdmin && (
            <div className="hidden md:block">
              <AdminPanel />
            </div>
          )}
          {account && (
            <div className="hidden md:block">
              <ReceiptsPanel />
            </div>
          )}
          <WalletConnect />
          <CartDrawer />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden neo-button p-1.5 sm:p-2 bg-card flex-shrink-0"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-foreground bg-card">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold hover:text-primary transition-colors py-2 uppercase">
              Shop
            </Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold hover:text-primary transition-colors py-2 uppercase">
              All Products
            </Link>
            <div className="pt-2 border-t border-foreground/10 flex flex-col gap-2">
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
  );
};

export default Navbar;
