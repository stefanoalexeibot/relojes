import React, { createContext, useContext, useState, useEffect } from 'react';
import { slugify } from '../lib/utils';

interface Product {
  title: string;
  price: string;
  category: string;
  slug?: string;
  img?: string | null;
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  clearWishlist: () => void;
  getWhatsAppUrl: () => string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rw_wishlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('rw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    const slug = product.slug || slugify(product.title);
    if (!wishlist.find(p => (p.slug || slugify(p.title)) === slug)) {
      setWishlist([...wishlist, { ...product, slug }]);
    }
  };

  const removeFromWishlist = (slug: string) => {
    setWishlist(wishlist.filter(p => (p.slug || slugify(p.title)) !== slug));
  };

  const isInWishlist = (slug: string) => {
    return !!wishlist.find(p => (p.slug || slugify(p.title)) === slug);
  };

  const clearWishlist = () => setWishlist([]);

  const getWhatsAppUrl = () => {
    const message = `Hola, me interesa cotizar estos relojes de Royal Watch:\n\n${wishlist.map((p, i) => `${i + 1}. ${p.title} (${p.price})`).join('\n')}\n\nTotal piezas: ${wishlist.length}`;
    return `https://wa.me/521234567890?text=${encodeURIComponent(message)}`;
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist, getWhatsAppUrl }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
