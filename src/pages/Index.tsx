import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit-react';
import WalletConnect from '@/components/WalletConnect';
import ProductCard from '@/components/ProductCard';
import CheckoutDialog from '@/components/CheckoutDialog';
import AdminPanel from '@/components/AdminPanel';
import ReceiptsPanel from '@/components/ReceiptsPanel';
import { useProductObjects } from '@/hooks/use-store-data';
import type { Product } from '@/types/store';
import { Store, Loader2 } from 'lucide-react';

const Index = () => {
  const account = useCurrentAccount();
  const { data: products, isLoading } = useProductObjects();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold">
              <span className="gradient-text">SuiMerch</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {account && <ReceiptsPanel />}
            {account && <AdminPanel />}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-5xl font-bold leading-tight md:text-6xl">
          On-Chain{' '}
          <span className="gradient-text glow-text">Merch Store</span>
        </h2>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Purchase exclusive merch with SUI. Each order mints a Receipt NFT as proof of purchase.
          Powered by Sui Move & Walrus storage.
        </p>
      </section>

      {/* Products Grid */}
      <main className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.objectId}
                product={product}
                onPurchase={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/50 py-20 text-center">
            <Store className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-xl font-semibold text-muted-foreground">No products yet</h3>
            <p className="mt-2 text-sm text-muted-foreground/70">
              {account
                ? 'Open the Admin Panel (⚙️) to create a store and add products.'
                : 'Connect your wallet to get started.'}
            </p>
          </div>
        )}
      </main>

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
