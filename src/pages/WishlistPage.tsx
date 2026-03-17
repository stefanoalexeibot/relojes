import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { Navbar } from '../components/Navbar';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, getWhatsAppUrl } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-8 py-12">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">Mi Selección</h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
              {wishlist.length} {wishlist.length === 1 ? 'Pieza seleccionada' : 'Piezas seleccionadas'}
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <div className="flex gap-4">
              <button 
                onClick={clearWishlist}
                className="px-6 py-4 rounded-2xl border border-white/5 text-white/30 hover:text-white hover:border-white/10 transition-all text-sm font-bold uppercase tracking-widest"
              >
                Limpiar lista
              </button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#c9a84c] text-black px-10 py-4 rounded-2xl font-black text-center shadow-lg shadow-[#c9a84c]/20 hover:bg-[#b8962e] transition-all"
              >
                Cotizar Todo por WhatsApp
              </motion.a>
            </div>
          )}
        </header>

        {wishlist.length === 0 ? (
          <div className="py-32 text-center">
            <div className="inline-flex p-12 bg-[#111] rounded-[64px] mb-8 border border-white/5">
              <span className="text-6xl opacity-20 text-[#c9a84c]">❤️</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Tu lista está vacía</h2>
            <p className="text-white/40 text-lg mb-10 max-w-md mx-auto">Explora nuestro catálogo y selecciona las piezas que más te gusten para cotizarlas juntas.</p>
            <Link to="/" className="inline-block bg-white/5 border border-white/10 text-white px-12 py-5 rounded-[32px] font-black hover:bg-white/10 transition-all text-lg">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <motion.div
                  key={product.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-[#111] rounded-[40px] border border-white/5 p-6 hover:border-[#c9a84c]/30 transition-all"
                >
                  <div 
                    className="relative aspect-square mb-6 rounded-3xl overflow-hidden bg-[#0d0d0d] cursor-pointer"
                    onClick={() => navigate(`/producto/${product.slug}`)}
                  >
                    <img 
                      src={product.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.slug!); }}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white/50 hover:text-red-500 border border-white/10 hover:border-red-500/30 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[#c9a84c] text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#c9a84c] transition-colors line-clamp-1">{product.title}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8 border-t border-white/5 pt-6">
                    <span className="text-2xl font-black text-[#c9a84c]">{product.price}</span>
                    <Link to={`/producto/${product.slug}`} className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                      Ver detalles →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
