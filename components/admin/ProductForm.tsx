"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Product, categories } from "@/lib/data";
import { uploadImage } from "@/services/storage";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  product: Partial<Product>;
  setProduct: (product: Partial<Product>) => void;
}

export default function ProductForm({ isOpen, onClose, onSubmit, product, setProduct }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fallbackImage = "/images/fallback.webp";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state on new file
    setImgError(false);

    // Validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Formato inválido. Use apenas JPG, PNG ou WEBP.");
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("Arquivo muito grande. O limite é 2MB.");
      return;
    }

    if (file.size === 0) {
      alert("O arquivo está vazio.");
      return;
    }

    setUploading(true);
    try {
      const uniqueId = typeof crypto.randomUUID === "function" 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);
      const fileName = `${uniqueId}-${file.name}`;
      const path = `products/${fileName}`;
      const downloadURL = await uploadImage(file, path);
      
      // Note: In the future, we could delete the previous image from Storage here
      // if (product.imageUrl && product.imageUrl.includes("firebasestorage")) { ... }
      
      setProduct({ ...product, imageUrl: downloadURL });
    } catch (error) {
      alert("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[10%] z-[110] mx-auto max-w-xl overflow-hidden rounded-3xl bg-[#0f0f0f] border border-white/10 shadow-2xl"
          >
            <form onSubmit={onSubmit} className="flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between border-b border-white/5 p-6">
                <h2 className="text-xl font-bold">{product.id ? "Editar Produto" : "Novo Produto"}</h2>
                <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-white/5">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Imagem do Produto</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] transition-all hover:border-primary/50 hover:bg-white/[0.05]"
                  >
                    {product.imageUrl ? (
                      <>
                        <img 
                          src={imgError ? fallbackImage : product.imageUrl} 
                          alt="Preview" 
                          onError={() => setImgError(true)}
                          className="h-full w-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <ImageIcon className="h-10 w-10 opacity-20" />
                        <span className="text-sm">Clique para enviar imagem</span>
                      </div>
                    )}
                    
                    {uploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="mt-2 text-xs font-bold text-white">Enviando...</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <input 
                    type="text" 
                    value={product.imageUrl}
                    onChange={(e) => {
                      setImgError(false);
                      setProduct({...product, imageUrl: e.target.value});
                    }}
                    className="w-full rounded-xl bg-white/5 p-3 text-xs text-gray-500 outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Ou cole a URL da imagem aqui"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Nome do Produto</label>
                    <input 
                      type="text" 
                      value={product.name}
                      onChange={(e) => setProduct({...product, name: e.target.value})}
                      className="w-full rounded-xl bg-white/5 p-3 outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Preço (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={product.price}
                      onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                      className="w-full rounded-xl bg-white/5 p-3 outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Categoria</label>
                    <select 
                      value={product.category}
                      onChange={(e) => setProduct({...product, category: e.target.value})}
                      className="w-full rounded-xl bg-white/5 p-3 outline-none focus:ring-1 focus:ring-primary appearance-none"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-[#0f0f0f]">{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Descrição</label>
                    <textarea 
                      value={product.description}
                      onChange={(e) => setProduct({...product, description: e.target.value})}
                      className="w-full rounded-xl bg-white/5 p-3 outline-none focus:ring-1 focus:ring-primary"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <input 
                      type="checkbox" 
                      id="active"
                      checked={product.active}
                      onChange={(e) => setProduct({...product, active: e.target.checked})}
                      className="h-5 w-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-300">Produto Ativo (visível no cardápio)</label>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 bg-white/[0.02] p-6">
                <button 
                  type="submit"
                  disabled={uploading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-bold text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Save className="h-5 w-5" />
                  Salvar Produto
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
