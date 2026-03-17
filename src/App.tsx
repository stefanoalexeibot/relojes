import productsData from './data/products.json';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Product type definition
interface Product {
  title: string;
  price: string;
  link: string;
  img: string;
  category: string;
}

const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[60]">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-2xl font-black tracking-tighter text-blue-600"
    >
      ROYAL WATCH
    </motion.div>
    <div className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
      <a href="#catalogo" className="hover:text-blue-600 transition-colors">Colecciones</a>
      <a href="#beneficios" className="hover:text-blue-600 transition-colors">Beneficios</a>
      <a href="#" className="hover:text-blue-600 transition-colors">Contacto</a>
    </div>
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
    >
      Catálogo
    </motion.button>
  </nav>
);

const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center justify-center bg-slate-50 overflow-hidden py-20">
    <div className="container mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center md:text-left"
      >
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-blue-600 font-bold tracking-widest text-[10px] uppercase">Réplicas 1:1 de Alta Gama</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
          El Lujo <br/><span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Accesible.</span>
        </h1>
        <p className="text-slate-500 text-lg mb-10 max-w-lg leading-relaxed text-balance">
          Curamos la mejor selección de relojes de lujo del mundo. Calidad suiza, materiales premium y envíos asegurados a todo México.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <motion.a 
            whileHover={{ y: -4 }}
            href="#catalogo" 
            className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 text-lg text-center"
          >
            Explorar Colección
          </motion.a>
          <button className="bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-3xl font-bold hover:bg-slate-50 transition-all text-lg">
            Saber Más
          </button>
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative group perspective-1000"
      >
        <div className="absolute -inset-4 bg-blue-600/5 rounded-[40px] blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800" 
          alt="Luxury Watch Hero" 
          className="relative z-10 w-full aspect-[4/5] object-cover rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-4 transition-transform duration-700"
        />
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const items = [
    { title: "Calidad 1:1", desc: "Materiales y peso idénticos al original.", icon: "💎" },
    { title: "Envío Express", desc: "Entrega segura en 24-48h a todo México.", icon: "📦" },
    { title: "Garantía", desc: "Soporte y garantía en todos nuestros modelos.", icon: "🛡️" },
    { title: "Pago Seguro", desc: "Métodos de pago confiables y encriptados.", icon: "💳" },
  ];

  return (
    <section id="beneficios" className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { name: "Carlos R.", city: "CDMX", text: "Impresionado con la calidad del Submariner. Es pesado, el cristal es zafiro real. Excelente servicio.", stars: 5 },
    { name: "Andrés M.", city: "Monterrey", text: "Llegó en 2 días a Monterrey. El empaque y el reloj son de primer nivel. Recomendado 100%.", stars: 5 },
    { name: "Sofía L.", city: "Guadalajara", text: "Atención al cliente impecable por WhatsApp. Resolvieron todas mis dudas antes de comprar.", stars: 5 },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl font-black mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[40px] bg-slate-800/50 border border-slate-700 backdrop-blur-sm"
            >
              <div className="flex text-yellow-500 mb-6 font-bold">{"★".repeat(rev.stars)}</div>
              <p className="text-lg italic text-slate-300 mb-8 font-medium">"{rev.text}"</p>
              <div>
                <p className="font-black text-white">{rev.name}</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{rev.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductModal = ({ product, isOpen, onClose }: { product: Product | null, isOpen: boolean, onClose: () => void }) => {
  if (!product) return null;

  const whatsappLink = `https://wa.me/521234567890?text=Hola,%20me%20interesa%20el%20reloj:%20${encodeURIComponent(product.title)}%20(${product.price})`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-4xl rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 z-10 p-3 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="md:w-1/2 bg-slate-50 p-12 flex items-center justify-center">
              <motion.img 
                layoutId={`img-${product.title}`}
                src={product.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'} 
                alt={product.title}
                className="w-full h-auto object-contain rounded-3xl"
              />
            </div>
            
            <div className="md:w-1/2 p-12 flex flex-col justify-center">
              <span className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 inline-block px-4 py-1.5 bg-blue-50 rounded-full w-max">
                {product.category}
              </span>
              <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{product.title}</h2>
              <div className="space-y-6 mb-10">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">Inversión</p>
                  <p className="text-5xl font-black text-slate-900 tracking-tighter">{product.price}</p>
                </div>
                <div className="text-slate-500 leading-relaxed text-sm">
                  Maquinaria de movimiento continuo, cristal de zafiro anti-rayas y acero quirúrgico 316L. Incluye caja premium de regalo.
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <motion.a 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white py-5 rounded-3xl font-bold text-center hover:bg-green-600 transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 text-lg"
                >
                  Confirmar Disponibilidad
                </motion.a>
                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Pagos vía Transferencia o Tarjeta</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductCard = ({ product, onOpen, isLoading }: { product: Product, onOpen: (p: Product) => void, isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-[40px] p-5 h-[450px] animate-pulse">
        <div className="aspect-square bg-slate-200 rounded-[32px] mb-6"></div>
        <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded-full w-1/2 mb-8"></div>
        <div className="flex justify-between items-center mt-auto">
          <div className="h-8 bg-slate-200 rounded-full w-24"></div>
          <div className="h-12 w-12 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      onClick={() => onOpen(product)}
      className="group bg-white rounded-[40px] border border-slate-100 p-5 hover:border-blue-100 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-square mb-6 overflow-hidden rounded-[32px] bg-slate-100/50">
        <motion.img 
          layoutId={`img-${product.title}`}
          src={product.img && !product.img.startsWith('data') ? product.img : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'} 
          alt={product.title}
          loading="lazy"
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-5 left-5">
          <span className="bg-white/95 backdrop-blur-md border border-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-blue-600 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 h-14 leading-tight tracking-tight">
        {product.title}
      </h3>
      <div className="flex items-center justify-between mt-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inversión</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">{product.price}</span>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center group-hover:rotate-90 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

const WhatsAppFloat = () => (
  <motion.a 
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: 1, rotate: 0 }}
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    href="https://wa.me/521234567890"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-10 right-10 z-[100] bg-green-500 text-white p-5 rounded-full shadow-2xl shadow-green-200 flex items-center justify-center group pointer-events-auto"
  >
    <div className="absolute -top-12 right-0 bg-white text-slate-900 px-4 py-2 rounded-2xl text-xs font-black shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100">
      ¿Necesitas ayuda? 👋
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 448 512">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 445.9c-33.1 0-65.7-8.9-94.1-25.7l-6.7-4-69.8 18.3L72 365.9l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.5-27.4-16.4-14.6-27.5-32.7-30.7-38.3-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.9-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.7z"/>
    </svg>
  </motion.a>
);

function App() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => ['all', ...new Set(productsData.map(p => p.category))], []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p: any) => {
      const matchesFilter = filter === 'all' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-600 scroll-smooth">
      <Navbar />
      <Hero />
      <Features />
      
      <main id="catalogo" className="container mx-auto px-8 py-24 border-t border-slate-50">
        <div className="flex flex-col items-center mb-16 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Catálogo Maestro</h2>
              <div className="h-2 w-24 bg-blue-600 rounded-full mb-8"></div>
              <p className="text-slate-500 max-w-lg mb-12 text-lg">Inversiones en piezas de relojería que mantienen su valor y distinción.</p>
            </motion.div>

            <div className="w-full max-w-5xl bg-slate-50 p-3 rounded-[40px] border border-slate-100 flex flex-col lg:flex-row gap-3 shadow-sm">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Busca por marca (Rolex, Omega, AP)..." 
                  className="w-full h-16 pl-14 pr-6 bg-white rounded-3xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600 transition-all font-semibold outline-none text-slate-800"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilter(cat);
                      setSearch('');
                    }}
                    className={`px-8 h-16 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                      filter === cat 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                      : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'Colección Completa' : cat}
                  </button>
                ))}
              </div>
            </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductCard key={i} product={{} as any} onOpen={() => {}} isLoading />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {filteredProducts.slice(0, visibleCount).map((product: any, idx) => (
                  <ProductCard 
                    key={product.title + idx} 
                    product={product} 
                    onOpen={(p) => setSelectedProduct(p)} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredProducts.length > visibleCount && (
              <div className="text-center mt-24">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="bg-slate-950 text-white font-black px-16 py-6 rounded-[32px] hover:bg-slate-900 transition-all shadow-2xl shadow-slate-300 text-lg"
                >
                  Continuar Explorando
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center">
            <div className="inline-flex p-8 bg-slate-50 rounded-[48px] mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">No se encontraron piezas</h3>
            <p className="text-slate-500 text-lg">Intenta con otros términos como "Rolex" o "Submariner".</p>
          </div>
        )}
      </main>

      <Testimonials />

      <footer className="bg-slate-950 text-white py-24 px-8">
        <div className="container mx-auto grid md:grid-cols-4 gap-16 text-center md:text-left">
          <div className="col-span-2">
            <div className="text-3xl font-black tracking-tighter mb-8 text-blue-500">ROYAL WATCH</div>
            <p className="text-slate-400 max-w-sm mx-auto md:mx-0 mb-10 leading-[1.8] text-lg font-medium">
              Elevando el estándar de las réplicas de lujo. Pasión por los detalles y compromiso con la excelencia en cada milímetro.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
               {/* Socials placeholder */}
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">IG</div>
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">FB</div>
            </div>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs">Marcas</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Rolex Professional</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Cartier Santos de Cartier</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Omega Masters</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Audemars Piguet Concept</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-white uppercase tracking-widest text-xs">Contacto</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li>Lunes a Domingo</li>
              <li>9:00 AM - 9:00 PM</li>
              <li>Soporte VIP 24/7</li>
              <li className="text-blue-500">contacto@royalwatch.mx</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} Royal Watch Mexico &bull; High End Replicas
          </p>
          <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] flex gap-8">
             <a href="#" className="hover:text-white transition-colors">Privacidad</a>
             <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </footer>

      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <WhatsAppFloat />
    </div>
  );
}

export default App;
