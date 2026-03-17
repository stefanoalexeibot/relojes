import productsData from './data/products.json';
import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductPage from './pages/ProductPage';
import WishlistPage from './pages/WishlistPage';

// Componentes
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { ProductCard } from './components/ProductCard';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { PriceRangeSlider } from './components/PriceRangeSlider';

// Hooks y Utils
import { useDebounce } from './hooks/useDebounce';
import { useWishlist } from './context/WishlistContext';
import { slugify, parsePrice } from './lib/utils';

// ... (remaining CatalogPage code)
// I'll use multi_replace to only change necessary parts to save tokens if possible,
// but for now I'll provide the updated file structure to ensure routes are correct.
// Since App.tsx was already refactored, I just need to add the route.

interface Product {
  title: string;
  price: string;
  link: string | null;
  img: string | null;
  category: string;
  slug?: string;
}

const allPrices = (productsData as Product[]).map(p => parsePrice(p.price)).filter(Boolean);
const PRICE_MIN = Math.floor(Math.min(...allPrices));
const PRICE_MAX = Math.ceil(Math.max(...allPrices));

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';

  const [filter, setFilter] = useState(initialCat);
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw, 200);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [visibleCount, setVisibleCount] = useState(24);
  const [isLoading, setIsLoading] = useState(true);
  const { wishlist, addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => { setVisibleCount(24); }, [filter, search, sortBy, priceMin, priceMax, showFavsOnly]);

  const categories = useMemo(() => ['all', ...new Set(productsData.map(p => p.category))], []);

  const filteredProducts = useMemo(() => {
    let list = productsData.filter((p: any) => {
      const matchesCat = filter === 'all' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const price = parsePrice(p.price);
      const matchesPrice = price >= priceMin && price <= priceMax;
      const slug = p.slug || slugify(p.title);
      const matchesFav = !showFavsOnly || wishlist.some(p => (p.slug || slugify(p.title)) === slug);
      return matchesCat && matchesSearch && matchesPrice && matchesFav;
    });

    if (sortBy === 'price-asc') list = [...list].sort((a: any, b: any) => parsePrice(a.price) - parsePrice(b.price));
    if (sortBy === 'price-desc') list = [...list].sort((a: any, b: any) => parsePrice(b.price) - parsePrice(a.price));

    return list;
  }, [filter, search, sortBy, priceMin, priceMax, showFavsOnly, wishlist]);

  const handleFilterChange = (cat: string) => {
    setFilter(cat);
    setSearchRaw('');
    setSearchParams(cat === 'all' ? {} : { cat });
  };

  const isPriceFiltered = priceMin > PRICE_MIN || priceMax < PRICE_MAX;
  const activeFiltersCount = [filter !== 'all', search, isPriceFiltered, showFavsOnly].filter(Boolean).length;

  const resetFilters = () => {
    setFilter('all');
    setSearchRaw('');
    setSortBy('default');
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
    setShowFavsOnly(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#c9a84c]/20 selection:text-[#c9a84c] scroll-smooth">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />

      <main id="catalogo" className="container mx-auto px-8 py-24 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-12 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">Catálogo Maestro</h2>
          <div className="h-2 w-24 bg-[#c9a84c] rounded-full mb-6"></div>
          <p className="text-white/40 max-w-lg text-lg">Inversiones en piezas de relojería que mantienen su valor y distinción.</p>
        </motion.div>

        <div className="w-full bg-[#111] p-3 rounded-[40px] border border-white/5 flex flex-col lg:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Busca por marca o modelo..."
              className="w-full h-14 pl-12 pr-6 bg-[#1a1a1a] rounded-3xl border-none ring-1 ring-white/5 focus:ring-2 focus:ring-[#c9a84c]/60 transition-all font-semibold outline-none text-white placeholder:text-white/30 text-sm"
              value={searchRaw}
              onChange={e => setSearchRaw(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-4.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end items-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => handleFilterChange(cat)}
                className={`px-5 h-14 rounded-3xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                  filter === cat
                    ? 'bg-[#c9a84c] text-black shadow-[0_8px_30px_rgba(201,168,76,0.3)]'
                    : 'bg-[#1a1a1a] text-white/40 border border-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                {cat === 'all' ? 'Todo' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-4 min-w-[220px]">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Rango de precio</p>
            <PriceRangeSlider
              min={PRICE_MIN} max={PRICE_MAX}
              valueMin={priceMin} valueMax={priceMax}
              onChange={(mn, mx) => { setPriceMin(mn); setPriceMax(mx); }}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center flex-1">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="h-12 px-4 bg-[#111] border border-white/5 rounded-2xl text-white/60 text-xs font-bold uppercase tracking-widest outline-none hover:border-white/10 transition-colors cursor-pointer"
            >
              <option value="default">Ordenar: Relevancia</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
            </select>

            <button
              onClick={() => setShowFavsOnly(v => !v)}
              className={`h-12 px-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${
                showFavsOnly
                  ? 'bg-[#c9a84c]/10 border-[#c9a84c]/40 text-[#c9a84c]'
                  : 'bg-[#111] border-white/5 text-white/40 hover:text-white hover:border-white/10'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${showFavsOnly ? 'fill-[#c9a84c]' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favoritos {wishlist.length > 0 && `(${wishlist.length})`}
            </button>

            <div className="flex bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`h-12 px-4 flex items-center gap-2 text-xs font-black transition-all ${viewMode === 'grid' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'text-white/30 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`h-12 px-4 flex items-center gap-2 text-xs font-black transition-all border-l border-white/5 ${viewMode === 'list' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' : 'text-white/30 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {activeFiltersCount > 0 && (
              <button onClick={resetFilters}
                className="h-12 px-4 rounded-2xl text-xs font-black text-white/30 hover:text-white border border-white/5 hover:border-white/10 transition-all uppercase tracking-widest"
              >
                Limpiar ({activeFiltersCount})
              </button>
            )}
          </div>

          {!isLoading && (
            <div className="text-white/30 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <span className="text-[#c9a84c]">{filteredProducts.length.toLocaleString()}</span> relojes
            </div>
          )}
        </div>

        {isLoading ? (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
            : 'flex flex-col gap-3'
          }>
            {[...Array(viewMode === 'grid' ? 8 : 6)].map((_, i) => (
              <ProductCard key={i} product={{} as any} isLoading viewMode={viewMode} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <motion.div
              layout
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
                : 'flex flex-col gap-3'
              }
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.slice(0, visibleCount).map((product: any, idx) => {
                  const slug = product.slug || slugify(product.title);
                  return (
                    <ProductCard
                      key={product.title + idx}
                      product={product}
                      viewMode={viewMode}
                      isFav={isInWishlist(slug)}
                      onToggleFav={() => isInWishlist(slug) ? removeFromWishlist(slug) : addToWishlist(product)}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length > visibleCount && (
              <div className="text-center mt-16 flex flex-col items-center gap-3">
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">
                  Mostrando {Math.min(visibleCount, filteredProducts.length)} de {filteredProducts.length}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="border border-[#c9a84c]/40 text-[#c9a84c] font-black px-16 py-5 rounded-[32px] hover:bg-[#c9a84c]/10 transition-all text-lg"
                >
                  Continuar Explorando
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex p-8 bg-[#111] rounded-[48px] mb-8 border border-white/5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-white mb-4">No se encontraron piezas</h3>
            <p className="text-white/40 text-lg mb-8">Prueba ajustando los filtros o el rango de precio.</p>
            <button onClick={resetFilters} className="border border-[#c9a84c]/40 text-[#c9a84c] px-8 py-4 rounded-2xl font-bold hover:bg-[#c9a84c]/10 transition-all">
              Limpiar filtros
            </button>
          </div>
        )}
      </main>

      <Testimonials />

      <footer className="bg-black text-white py-24 px-8 border-t border-white/5">
        <div className="container mx-auto grid md:grid-cols-4 gap-16 text-center md:text-left">
          <div className="col-span-2">
            <div className="text-3xl font-black tracking-[0.3em] mb-8 text-[#c9a84c]">ROYAL WATCH</div>
            <p className="text-white/40 max-w-sm mx-auto md:mx-0 mb-10 leading-[1.8] text-lg font-medium">
              Elevando el estándar de las réplicas de lujo. Pasión por los detalles y compromiso con la excelencia en cada milímetro.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors cursor-pointer text-white/40 text-sm font-bold">IG</div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors cursor-pointer text-white/40 text-sm font-bold">FB</div>
            </div>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs">Marcas</h4>
            <ul className="space-y-4 text-white/40 font-bold text-sm">
              <li><a href="#" className="hover:text-[#c9a84c] transition-colors">Rolex Professional</a></li>
              <li><a href="#" className="hover:text-[#c9a84c] transition-colors">Cartier Santos de Cartier</a></li>
              <li><a href="#" className="hover:text-[#c9a84c] transition-colors">Omega Masters</a></li>
              <li><a href="#" className="hover:text-[#c9a84c] transition-colors">Audemars Piguet Concept</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs">Contacto</h4>
            <ul className="space-y-4 text-white/40 font-bold text-sm">
              <li>Lunes a Domingo</li>
              <li>9:00 AM - 9:00 PM</li>
              <li>Soporte VIP 24/7</li>
              <li className="text-[#c9a84c]">contacto@royalwatch.mx</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Royal Watch Mexico &bull; High End Replicas
          </p>
          <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] flex gap-8">
            <a href="#" className="hover:text-white/60 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white/60 transition-colors">Términos</a>
          </div>
        </div>
      </footer>
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/producto/:slug" element={<ProductPage />} />
      <Route path="/lista-de-deseos" element={<WishlistPage />} />
    </Routes>
  );
}
