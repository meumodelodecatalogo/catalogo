"use client";

import { useState, useEffect } from "react";
import { login, logout, onAuthChange, User } from "@/services/auth";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/services/firestore";
import { categories, Product } from "@/lib/data";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Plus, 
  LogOut, 
  Loader2
} from "lucide-react";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: categories[0],
    imageUrl: "",
    active: true
  });

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadProducts();
      }
    });
    return () => unsubscribe();
  }, []);

  async function loadProducts() {
    const data = await getProducts(false);
    setProducts(data);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch (err: any) {
      setError("Falha no login. Verifique suas credenciais.");
    }
  }

  async function handleLogout() {
    await logout();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validations
    if (!currentProduct.name?.trim()) {
      alert("O nome do produto é obrigatório.");
      return;
    }
    if (!currentProduct.price || currentProduct.price <= 0) {
      alert("O preço deve ser maior que zero.");
      return;
    }
    if (!currentProduct.category) {
      alert("A categoria é obrigatória.");
      return;
    }
    if (!currentProduct.imageUrl) {
      alert("A imagem do produto é obrigatória.");
      return;
    }

    try {
      if (currentProduct.id) {
        await updateProduct(currentProduct.id, currentProduct);
      } else {
        await createProduct(currentProduct);
      }
      setIsEditing(false);
      setCurrentProduct({
        name: "",
        description: "",
        price: 0,
        category: categories[0],
        imageUrl: "",
        active: true
      });
      loadProducts();
    } catch (err) {
      alert("Erro ao salvar produto.");
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (err) {
        alert("Erro ao excluir produto.");
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl bg-white/5 p-8 border border-white/10"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-2xl">
              P
            </div>
            <h1 className="text-2xl font-bold">Painel Admin</h1>
            <p className="text-gray-400">Acesse para gerenciar o cardápio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/5 p-3 outline-none ring-primary/50 focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/5 p-3 outline-none ring-primary/50 focus:ring-2"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button 
              type="submit"
              className="w-full rounded-xl bg-primary py-3 font-bold text-white transition-transform active:scale-95"
            >
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header Admin */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-tight">ADMIN<span className="text-primary">PANEL</span></span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Cardápio</h1>
            <p className="text-gray-400">Adicione ou edite os produtos da sua pizzaria</p>
          </div>
          <button 
            onClick={() => {
              setCurrentProduct({
                name: "",
                description: "",
                price: 0,
                category: categories[0],
                imageUrl: "",
                active: true
              });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Novo Produto
          </button>
        </div>

        <ProductList 
          products={products} 
          onEdit={(product) => {
            setCurrentProduct(product);
            setIsEditing(true);
          }} 
          onDelete={handleDelete} 
        />
      </main>

      <ProductForm 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        onSubmit={handleSubmit} 
        product={currentProduct} 
        setProduct={setCurrentProduct} 
      />
    </div>
  );
}
