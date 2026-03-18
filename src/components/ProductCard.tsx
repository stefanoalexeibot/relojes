import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Product {
  title: string;
  price: string;
  link: string | null;
  img: string | null;
  category: string;
  slug: string;
}

interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
  isFav?: boolean;
  onToggleFav?: (slug: string) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({
  product, isLoading, isFav, onToggleFav, viewMode = 'grid',
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  if (isLoading) {
    if (viewMode === 'list') {
      return (
        <div className="bg-[#111] rounded-3xl p-4 h-28 animate-pulse border border-white/5 flex gap-4">
          <div className="w-20 h-20 bg-[#222] rounded-2xl flex-shrink-0"></div>
          <div className="flex-1 space-y-3 py-2">
            <div className="h-4 bg-[#222] rounded-full w-3/4"></div>
            <div className="h-4 bg-[#222] rounded-full w-1/3"></div>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-[#111] rounded-[40px] p-5 h-[450px] animate-pulse border border-white/5">
        <div className="aspect-square bg-[#222] rounded-[32px] mb-6"></div>
        <div className="h-4 bg-[#222] rounded-full w-3/4 mb-3"></div>
        <div className="h-4 bg-[#222] rounded-full w-1/2 mb-8"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-[#222] rounded-full w-24"></div>
          <div className="h-12 w-12 bg-[#222] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const slug = product.slug || ''; // Should always be present from Supabase
  const imgSrc = product.img && !product.img.startsWith('data')
    ? product.img
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400';

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFav?.(slug);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(`/producto/${slug}`)}
        className="group bg-[#111] rounded-3xl border border-white/5 p-4 hover:border-[#c9a84c]/40 hover:shadow-[0_10px_40px_-10px_rgba(201,168,76,0.15)] transition-all cursor-pointer flex items-center gap-5"
      >
        <div className="w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-[#0d0d0d] relative">
          {!imgLoaded && <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse rounded-2xl" />}
          <img src={imgSrc} alt={product.title} loading="lazy" onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[#c9a84c] text-[9px] font-black uppercase tracking-widest">{product.category}</span>
          <h3 className="text-white/90 font-bold text-sm leading-tight truncate group-hover:text-[#c9a84c] transition-colors">{product.title}</h3>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[#c9a84c] font-black text-lg">{product.price}</span>
          <button onClick={handleFav} className="p-2 rounded-xl bg-white/5 hover:bg-[#c9a84c]/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isFav ? 'fill-[#c9a84c] text-[#c9a84c]' : 'text-white/30'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/producto/${slug}`)}
      className="group bg-[#111] rounded-[40px] border border-white/5 p-5 hover:border-[#c9a84c]/40 hover:shadow-[0_40px_80px_-20px_rgba(201,168,76,0.15)] transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-square mb-6 overflow-hidden rounded-[32px] bg-[#0d0d0d]">
        {!imgLoaded && <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />}
        <img
          src={imgSrc}
          alt={product.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`object-cover w-full h-full group-hover:scale-110 transition-all duration-1000 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute top-5 left-5">
          <span className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-[#c9a84c]">
            {product.category}
          </span>
        </div>
        <button
          onClick={handleFav}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#c9a84c]/40 transition-all opacity-0 group-hover:opacity-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-colors ${isFav ? 'fill-[#c9a84c] text-[#c9a84c]' : 'text-white/50'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <h3 className="font-bold text-white/90 text-lg mb-2 group-hover:text-[#c9a84c] transition-colors line-clamp-2 h-14 leading-tight tracking-tight">
        {product.title}
      </h3>
      <div className="flex items-center justify-between mt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Inversión</span>
          <span className="text-2xl font-black text-[#c9a84c] tracking-tight">{product.price}</span>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-[#c9a84c]/10 text-[#c9a84c] group-hover:bg-[#c9a84c] group-hover:text-black transition-all duration-300 flex items-center justify-center group-hover:rotate-90">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};
