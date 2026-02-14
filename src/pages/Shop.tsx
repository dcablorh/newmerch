import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useProductObjects } from "@/hooks/use-store-data";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/store";
import { Loader2, Store, Package, Shirt, Watch, RefreshCw } from "lucide-react";

const CATEGORIES = [
  { label: "All Products", desc: "Browse everything", icon: Package },
  { label: "Tops", desc: "Hoodies & Polos", icon: Shirt },
  { label: "Jerseys", desc: "Sports & Street", icon: Shirt },
  { label: "Accessories", desc: "Hats & Bags", icon: Watch },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name A-Z", value: "name-asc" },
];

const Shop = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProductObjects();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("newest");

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const sorted = [...products];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.reverse();
    }
    return sorted;
  }, [products, sortBy]);

  return (
    <div className="min-h-screen bg-background dot-pattern font-sans">
      <Navbar />

      {/* Hero */}
      <section className="container mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-4 sm:pb-6 text-center">
        <h1 className="font-display text-3xl sm:text-5xl md:text-7xl uppercase tracking-tight">
          Find Your Vibe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-medium">Official Sui Merch Collection</p>
      </section>

      <section className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-20">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <h3 className="font-display text-lg uppercase mb-3">Filters</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`w-full neo-card p-3 sm:p-4 flex items-center gap-3 text-left transition-all ${
                      isActive ? "bg-accent text-accent-foreground" : "bg-card hover:translate-y-[-1px]"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm">{cat.label}</p>
                      <p className="text-[10px] text-muted-foreground">{cat.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="neo-card bg-card p-3 flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-sm font-bold">
                Showing {sortedProducts.length} Results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="neo-border rounded-lg px-3 py-1.5 text-xs font-bold bg-card cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => { setSortBy("newest"); setActiveCategory("All Products"); }}
                  className="neo-button p-1.5 bg-card"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.objectId}
                    product={product}
                    onPurchase={(p) => addToCart(p)}
                    onClick={() => navigate(`/product/${product.objectId}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="neo-card border-dashed p-12 text-center bg-card">
                <Store className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                <h3 className="font-display text-lg uppercase">No Products Found</h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
