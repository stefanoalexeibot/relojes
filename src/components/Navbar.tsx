import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const { wishlist } = useWishlist();
  
  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-[60]">
      <Link
        to="/"
        className="text-2xl font-black tracking-[0.3em] text-[#c9a84c] cursor-pointer"
        onClick={() => {
          if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        ROYAL WATCH
      </Link>
      
      <div className="hidden md:flex space-x-8 text-sm font-semibold text-white/60 items-center">
        <a href="/#catalogo" className="hover:text-[#c9a84c] transition-colors">Colecciones</a>
        <a href="/#como-funciona" className="hover:text-[#c9a84c] transition-colors">¿Cómo funciona?</a>
        <a href="/#beneficios" className="hover:text-[#c9a84c] transition-colors">Beneficios</a>
        <Link to="/lista-de-deseos" className="relative group hover:text-[#c9a84c] transition-colors flex items-center gap-2">
          <span>Mi Selección</span>
          {wishlist.length > 0 && (
            <span className="bg-[#c9a84c] text-black text-[10px] font-black h-4 min-w-[1rem] flex items-center justify-center rounded-full px-1">
              {wishlist.length}
            </span>
          )}
        </Link>
      </div>

      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href="/#catalogo"
        className="border border-[#c9a84c] text-[#c9a84c] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#c9a84c] hover:text-black transition-all"
      >
        Catálogo
      </motion.a>
    </nav>
  );
};
