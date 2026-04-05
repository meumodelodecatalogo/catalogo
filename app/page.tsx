"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import { products as mockProducts, categories } from "@/lib/data";
import { motion, AnimatePresence } from "motion/react";
import { getProducts } from "@/services/firestore";
import { Product } from "@/lib/data";

import CartButton from "@/components/CartButton";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/context/CartContext";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  const { toast } = useCart();
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const firestoreProducts = await getProducts();
        if (firestoreProducts && firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
        } else if (process.env.NODE_ENV === "development") {
          // Use mock data only in development if Firestore is empty
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setError("Não foi possível carregar o cardápio. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => 
    products.filter(
      (product) => product.category === activeCategory && product.active
    ),
    [products, activeCategory]
  );

  return (
    <main className="min-h-screen pb-24">
      <Header />
      <Hero />
      <CategoryTabs 
        id="menu"
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{activeCategory}</h2>
          <p className="text-gray-400">Confira nossas opções selecionadas para você.</p>
        </div>

        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-gray-500">Carregando cardápio...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-xl font-bold text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    allProducts={products}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <p className="text-xl text-gray-500">Nenhum produto encontrado nesta categoria.</p>
              </div>
            )}
          </>
        )}
      </div>

      <CartButton />
      <Suspense fallback={null}>
        <CartSidebar />
      </Suspense>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-[200] flex items-center gap-3 rounded-2xl bg-green-500 px-6 py-4 font-bold text-white shadow-2xl shadow-green-500/20"
          >
            <CheckCircle2 className="h-5 w-5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 border-t border-white/5 bg-black/40 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              D
            </div>
            <span className="text-lg font-bold tracking-tight">
              DI CAZA<span className="text-primary"> PIZZARIA</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 Di Caza Pizzaria. Todos os direitos reservados. <br />
            A verdadeira experiência da pizza artesanal.
          </p>
        </div>
      </footer>
    </main>
  );
}
