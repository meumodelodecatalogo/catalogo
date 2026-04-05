"use client";

import { memo, useState } from "react";
import { Product } from "@/lib/data";
import { Edit2, Trash2, Eye, EyeOff, Package } from "lucide-react";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

function ProductListItem({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product; 
  onEdit: (product: Product) => void; 
  onDelete: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = "/images/fallback.webp";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10">
      <div className="mb-4 aspect-video overflow-hidden rounded-xl">
        <img 
          src={imgError ? fallbackImage : product.imageUrl} 
          alt={product.name} 
          onError={() => setImgError(true)}
          loading="lazy"
          className="h-full w-full object-cover" 
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{product.category}</span>
          {product.active ? (
            <span className="flex items-center gap-1 text-[10px] text-green-500"><Eye className="h-3 w-3" /> ATIVO</span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-red-500"><EyeOff className="h-3 w-3" /> INATIVO</span>
          )}
        </div>
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-sm font-bold text-primary">R$ {product.price.toFixed(2).replace(".", ",")}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button 
          onClick={() => onEdit(product)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-sm font-medium hover:bg-white/10"
        >
          <Edit2 className="h-4 w-4" /> Editar
        </button>
        <button 
          onClick={() => onDelete(product.id)}
          className="flex items-center justify-center rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/5 text-gray-500">
        <Package className="mb-2 h-12 w-12 opacity-20" />
        <p>Nenhum produto cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductListItem
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default memo(ProductList);
