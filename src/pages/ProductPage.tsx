import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { TrustBadges } from '../components/TrustBadges';
import { ImageGallery } from '../components/ImageGallery';
import { useWishlist } from '../context/WishlistContext';
import { productService, type Product } from '../services/productService';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewerCount] = useState(() => Math.floor(Math.random() * 8) + 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadProduct() {
      if (!slug) return;
      try {
        setIsLoading(true);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
        
        // Load related products
        const allProducts = await productService.getProducts();
        const relatedList = allProducts
          .filter(p => p.category === data.category && p.slug !== slug)
          .slice(0, 4);
        setRelated(relatedList);
      } catch (err) {
        console.error('Error loading product:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin"></div>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Cargando pieza...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-white/30 text-6xl mb-6">404</p>
          <h1 className="text-2xl font-black mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-[#c9a84c] hover:underline">← Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const specImages: string[] = Array.isArray(product.specs?.images) ? product.specs.images.filter(Boolean) : [];
  const mainImg = product.img || FALLBACK_IMG;
  const allImages = specImages.length > 0 ? specImages : [mainImg];

  const whatsappLink = `https://wa.me/521234567890?text=Hola,%20me%20interesa%20el%20reloj:%20${encodeURIComponent(product.title)}%20(${product.price})`;

  const isFav = isInWishlist(slug || '');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />

      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center gap-2 text-xs text-white/30 font-semibold uppercase tracking-widest">
          <Link to="/" className="hover:text-[#c9a84c] transition-colors">Inicio</Link>
          <span>/</span>
          <Link to={`/?cat=${encodeURIComponent(product.category)}`} className="hover:text-[#c9a84c] transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-white/50 truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-28">
            <ImageGallery images={allImages} title={product.title} />
          </div>

          <div>
            <div className="flex justify-between items-start mb-6">
              <span className="inline-block px-4 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-full text-[#c9a84c] text-xs font-black uppercase tracking-widest">
                {product.category}
              </span>
              <button 
                onClick={() => isFav ? removeFromWishlist(slug!) : addToWishlist(product)}
                className={`p-3 rounded-2xl border transition-all ${isFav ? 'bg-[#c9a84c]/10 border-[#c9a84c]/40 text-[#c9a84c]' : 'bg-white/5 border-white/10 text-white/30 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFav ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-8">
              {product.title}
            </h1>

            <div className="mb-8 pb-8 border-b border-white/5 flex flex-wrap gap-6">
              <div>
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">Inversión</p>
                <p className="text-5xl font-black text-[#c9a84c] tracking-tighter">{product.price}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">{viewerCount} personas viendo ahora</span>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest text-white/40 mb-3">Descripción</h3>
              <p className="text-white/60 leading-relaxed">
                {product.description || 'Maquinaria de movimiento continuo, cristal de zafiro anti-rayas y acero quirúrgico 316L. Réplica 1:1 con materiales idénticos al original. Incluye caja premium de regalo y garantía.'}
              </p>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-8 pb-8 border-b border-white/5">
                <div className="space-y-4 mb-8">
              <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-30">Especificaciones Maestras</h3>
              <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                {Object.entries(product.specs || {}).map(([key, value]) => (
                  <div key={key} className="bg-black p-4 flex flex-col gap-1 hover:bg-white/[0.02] transition-colors">
                    <span className="text-[#c9a84c] text-[9px] font-black uppercase tracking-wider">{key}</span>
                    <span className="text-white/80 text-xs font-medium">{String(value)}</span>
                  </div>
                ))}
                {/* Fallback if no specs */}
                {!product.specs && (
                  <>
                    <div className="bg-black p-4 flex flex-col gap-1">
                      <span className="text-[#c9a84c] text-[9px] font-black uppercase tracking-wider">Movimiento</span>
                      <span className="text-white/80 text-xs font-medium">Automático Premium</span>
                    </div>
                    <div className="bg-black p-4 flex flex-col gap-1">
                      <span className="text-[#c9a84c] text-[9px] font-black uppercase tracking-wider">Material</span>
                      <span className="text-white/80 text-xs font-medium">Acero 904L / Zafiro</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: '💎', text: 'Calidad 1:1' },
                { icon: '🔵', text: 'Cristal Zafiro' },
                { icon: '⚙️', text: 'Acero 316L' },
                { icon: '📦', text: 'Envío Express' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-[#111] border border-white/5 rounded-2xl px-4 py-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-white/60 text-sm font-semibold">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white py-5 rounded-3xl font-bold text-center hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 445.9c-33.1 0-65.7-8.9-94.1-25.7l-6.7-4-69.8 18.3L72 365.9l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.5-27.4-16.4-14.6-27.5-32.7-30.7-38.3-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.9-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.7z"/>
                </svg>
                Hablar con Asesor VIP Concierge
              </motion.a>
              <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-widest">
                Atención personalizada garantizada • Disponible 24/7
              </p>
              <TrustBadges />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/5">
            <h2 className="text-3xl font-black text-white mb-2">También te puede interesar</h2>
            <div className="h-1 w-16 bg-[#c9a84c] rounded-full mb-10"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/producto/${p.slug}`}
                    className="group bg-[#111] rounded-[32px] border border-white/5 p-4 hover:border-[#c9a84c]/40 hover:shadow-[0_20px_40px_-10px_rgba(201,168,76,0.15)] transition-all"
                  >
                    <div className="aspect-square bg-[#0d0d0d] rounded-2xl overflow-hidden mb-4">
                      <img
                        src={p.img || FALLBACK_IMG}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-white/80 group-hover:text-[#c9a84c] transition-colors line-clamp-2 mb-2 leading-tight">
                      {p.title}
                    </h3>
                    <p className="text-[#c9a84c] font-black text-lg">{p.price}</p>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox removed in favor of ImageGallery internal logic or simplified version */}
    </div>
  );
}
