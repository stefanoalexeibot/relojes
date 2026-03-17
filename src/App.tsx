import productsData from './data/products.json';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import ProductPage from './pages/ProductPage';

// ─── Utilidades ───────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useFavorites() {
  const [favs, setFavs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('rw_favs') || '[]'); } catch { return []; }
  });
  const toggle = useCallback((slug: string) => {
    setFavs(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      localStorage.setItem('rw_favs', JSON.stringify(next));
      return next;
    });
  }, []);
  return { favs, toggle };
}

// ─── Contador animado ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => {
    return spring.on('change', v => setDisplay(Math.round(v)));
  }, [spring]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

interface Product {
  title: string;
  price: string;
  link: string | null;
  img: string | null;
  category: string;
  slug?: string;
}

// ─── Precios globales ─────────────────────────────────────────────────────────
const allPrices = (productsData as Product[]).map(p => parsePrice(p.price)).filter(Boolean);
const PRICE_MIN = Math.floor(Math.min(...allPrices));
const PRICE_MAX = Math.ceil(Math.max(...allPrices));

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-[60]">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-2xl font-black tracking-[0.3em] text-[#c9a84c] cursor-pointer"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ROYAL WATCH
    </motion.div>
    <div className="hidden md:flex space-x-8 text-sm font-semibold text-white/60">
      <a href="#catalogo" className="hover:text-[#c9a84c] transition-colors">Colecciones</a>
      <a href="#como-funciona" className="hover:text-[#c9a84c] transition-colors">¿Cómo funciona?</a>
      <a href="#beneficios" className="hover:text-[#c9a84c] transition-colors">Beneficios</a>
    </div>
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href="#catalogo"
      className="border border-[#c9a84c] text-[#c9a84c] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#c9a84c] hover:text-black transition-all"
    >
      Catálogo
    </motion.a>
  </nav>
);

// ─── Hero con contadores animados ─────────────────────────────────────────────
const Hero = () => (
  <section className="relative min-h-[85vh] flex items-center justify-center bg-[#0a0a0a] overflow-hidden py-20">
    <div className="container mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center md:text-left"
      >
        <div className="inline-flex items-center space-x-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-4 py-2 rounded-full mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a84c] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9a84c]"></span>
          </span>
          <span className="text-[#c9a84c] font-bold tracking-widest text-[10px] uppercase">Réplicas 1:1 de Alta Gama</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white leading-[1] mb-8 tracking-tighter">
          El Lujo <br/><span className="text-[#c9a84c]">Accesible.</span>
        </h1>
        <p className="text-white/50 text-lg mb-10 max-w-lg leading-relaxed">
          Curamos la mejor selección de relojes de lujo del mundo. Calidad suiza, materiales premium y envíos asegurados a todo México.
        </p>

        {/* Contadores animados */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto md:mx-0">
          {[
            { value: productsData.length, suffix: '+', label: 'Modelos' },
            { value: 12, suffix: '', label: 'Marcas' },
            { value: 48, suffix: 'h', label: 'Entrega' },
          ].map(({ value, suffix, label }) => (
            <div key={label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-[#c9a84c]">
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <motion.a
            whileHover={{ y: -4 }}
            href="#catalogo"
            className="bg-[#c9a84c] text-black px-10 py-5 rounded-3xl font-bold hover:bg-[#b8962e] transition-all shadow-[0_20px_60px_rgba(201,168,76,0.25)] text-lg text-center"
          >
            Explorar Colección
          </motion.a>
          <a href="#como-funciona" className="border border-white/10 text-white/70 px-10 py-5 rounded-3xl font-bold hover:border-white/30 hover:text-white transition-all text-lg text-center">
            ¿Cómo funciona?
          </a>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative group"
      >
        <div className="absolute -inset-4 bg-[#c9a84c]/5 rounded-[40px] blur-3xl group-hover:bg-[#c9a84c]/10 transition-colors duration-700"></div>
        <img
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800"
          alt="Luxury Watch Hero"
          className="relative z-10 w-full aspect-[4/5] object-cover rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)] hover:-translate-y-4 transition-transform duration-700"
        />
      </motion.div>
    </div>
  </section>
);

// ─── Cómo funciona ────────────────────────────────────────────────────────────
const HowItWorks = () => {
  const steps = [
    { num: '01', icon: '🔍', title: 'Elige tu reloj', desc: 'Explora más de 1,200 modelos de las mejores marcas. Filtra por categoría o precio.' },
    { num: '02', icon: '💬', title: 'Confirma por WhatsApp', desc: 'Contáctanos directamente. Te asesoramos, confirmamos disponibilidad y acordamos el pago.' },
    { num: '03', icon: '📦', title: 'Recíbelo en casa', desc: 'Envío express en 24-48h a todo México. Empaque discreto y seguimiento en tiempo real.' },
  ];
  return (
    <section id="como-funciona" className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">¿Cómo funciona?</h2>
          <div className="h-1.5 w-20 bg-[#c9a84c] rounded-full"></div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Línea conectora (solo desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent"></div>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center p-8 bg-[#111] border border-white/5 rounded-[40px] hover:border-[#c9a84c]/30 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center text-2xl mb-6 relative z-10 bg-[#0a0a0a]">
                {step.icon}
              </div>
              <span className="text-[#c9a84c]/30 font-black text-xs tracking-widest uppercase mb-2">{step.num}</span>
              <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Features ─────────────────────────────────────────────────────────────────
const Features = () => {
  const items = [
    { title: "Calidad 1:1", desc: "Materiales y peso idénticos al original.", icon: "💎" },
    { title: "Envío Express", desc: "Entrega segura en 24-48h a todo México.", icon: "📦" },
    { title: "Garantía", desc: "Soporte y garantía en todos nuestros modelos.", icon: "🛡️" },
    { title: "Pago Seguro", desc: "Métodos de pago confiables y encriptados.", icon: "💳" },
  ];
  return (
    <section id="beneficios" className="py-24 bg-[#0d0d0d] border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[40px] bg-[#111] border border-white/5 hover:border-[#c9a84c]/30 transition-all group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
              <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
const Testimonials = () => {
  const reviews = [
    { name: "Carlos R.", city: "CDMX", text: "Impresionado con la calidad del Submariner. Es pesado, el cristal es zafiro real. Excelente servicio.", stars: 5 },
    { name: "Andrés M.", city: "Monterrey", text: "Llegó en 2 días a Monterrey. El empaque y el reloj son de primer nivel. Recomendado 100%.", stars: 5 },
    { name: "Sofía L.", city: "Guadalajara", text: "Atención al cliente impecable por WhatsApp. Resolvieron todas mis dudas antes de comprar.", stars: 5 },
  ];
  return (
    <section className="py-24 bg-black text-white overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl font-black mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <div className="h-1.5 w-20 bg-[#c9a84c] rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[40px] bg-white/[0.03] border border-white/5"
            >
              <div className="flex text-yellow-500 mb-6 font-bold">{"★".repeat(rev.stars)}</div>
              <p className="text-lg italic text-white/60 mb-8 font-medium">"{rev.text}"</p>
              <div>
                <p className="font-black text-white">{rev.name}</p>
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{rev.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── ProductCard con favorito + blur placeholder + lista/grid ─────────────────
const ProductCard = ({
  product, isLoading, isFav, onToggleFav, viewMode,
}: {
  product: Product; isLoading?: boolean; isFav?: boolean;
  onToggleFav?: (slug: string) => void; viewMode?: 'grid' | 'list';
}) => {
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

  const slug = product.slug || slugify(product.title);
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
        {/* Botón favorito */}
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

// ─── WhatsApp proactivo ───────────────────────────────────────────────────────
const WhatsAppFloat = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.a
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href="https://wa.me/521234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-10 right-10 z-[100] bg-green-500 text-white p-5 rounded-full shadow-2xl shadow-green-500/20 flex items-center justify-center group"
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute right-16 bg-[#111] text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-xl border border-white/10 whitespace-nowrap"
          >
            <p className="font-black mb-0.5">¿Te ayudamos a elegir? 👋</p>
            <p className="text-white/50">Respuesta en minutos</p>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTooltip(false); }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white/10 rounded-full text-white/50 text-[10px] flex items-center justify-center hover:bg-white/20"
            >✕</button>
          </motion.div>
        )}
      </AnimatePresence>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 448 512">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 445.9c-33.1 0-65.7-8.9-94.1-25.7l-6.7-4-69.8 18.3L72 365.9l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.5-27.4-16.4-14.6-27.5-32.7-30.7-38.3-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.9-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.7z"/>
      </svg>
    </motion.a>
  );
};

// ─── Slider de precio dual ────────────────────────────────────────────────────
const PriceRangeSlider = ({
  min, max, valueMin, valueMax, onChange,
}: {
  min: number; max: number; valueMin: number; valueMax: number;
  onChange: (min: number, max: number) => void;
}) => {
  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="px-2">
      <div className="flex justify-between text-xs text-white/40 font-bold mb-3">
        <span>MX${valueMin.toLocaleString()}</span>
        <span>MX${valueMax.toLocaleString()}</span>
      </div>
      <div className="relative h-1.5 bg-white/10 rounded-full">
        <div
          className="absolute h-full bg-[#c9a84c] rounded-full"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        <input type="range" min={min} max={max} value={valueMin}
          onChange={e => onChange(Math.min(+e.target.value, valueMax - 500), valueMax)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: valueMin > max - 100 ? 5 : 3 }}
        />
        <input type="range" min={min} max={max} value={valueMax}
          onChange={e => onChange(valueMin, Math.max(+e.target.value, valueMin + 500))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        {/* Thumbs */}
        <div className="absolute w-4 h-4 bg-[#c9a84c] border-2 border-black rounded-full -mt-[5px] pointer-events-none shadow-lg"
          style={{ left: `calc(${pctMin}% - 8px)` }} />
        <div className="absolute w-4 h-4 bg-[#c9a84c] border-2 border-black rounded-full -mt-[5px] pointer-events-none shadow-lg"
          style={{ left: `calc(${pctMax}% - 8px)` }} />
      </div>
    </div>
  );
};

// ─── Catalog Page ─────────────────────────────────────────────────────────────
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
  const { favs, toggle: toggleFav } = useFavorites();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Reset visible on filter change
  useEffect(() => { setVisibleCount(24); }, [filter, search, sortBy, priceMin, priceMax, showFavsOnly]);

  const categories = useMemo(() => ['all', ...new Set(productsData.map(p => p.category))], []);

  const filteredProducts = useMemo(() => {
    let list = productsData.filter((p: any) => {
      const matchesCat = filter === 'all' || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const price = parsePrice(p.price);
      const matchesPrice = price >= priceMin && price <= priceMax;
      const slug = p.slug || slugify(p.title);
      const matchesFav = !showFavsOnly || favs.includes(slug);
      return matchesCat && matchesSearch && matchesPrice && matchesFav;
    });

    if (sortBy === 'price-asc') list = [...list].sort((a: any, b: any) => parsePrice(a.price) - parsePrice(b.price));
    if (sortBy === 'price-desc') list = [...list].sort((a: any, b: any) => parsePrice(b.price) - parsePrice(a.price));

    return list;
  }, [filter, search, sortBy, priceMin, priceMax, showFavsOnly, favs]);

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
        {/* Encabezado del catálogo */}
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

        {/* Barra de búsqueda + categorías */}
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

        {/* Barra de controles: precio, ordenar, vista, favoritos */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center">
          {/* Precio */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-4 min-w-[220px]">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-3">Rango de precio</p>
            <PriceRangeSlider
              min={PRICE_MIN} max={PRICE_MAX}
              valueMin={priceMin} valueMax={priceMax}
              onChange={(mn, mx) => { setPriceMin(mn); setPriceMax(mx); }}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Ordenar */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="h-12 px-4 bg-[#111] border border-white/5 rounded-2xl text-white/60 text-xs font-bold uppercase tracking-widest outline-none hover:border-white/10 transition-colors cursor-pointer"
            >
              <option value="default">Ordenar: Relevancia</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
            </select>

            {/* Favoritos toggle */}
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
              Favoritos {favs.length > 0 && `(${favs.length})`}
            </button>

            {/* Vista grid/lista */}
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

            {/* Reset filtros */}
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters}
                className="h-12 px-4 rounded-2xl text-xs font-black text-white/30 hover:text-white border border-white/5 hover:border-white/10 transition-all uppercase tracking-widest"
              >
                Limpiar ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          {!isLoading && (
            <div className="text-white/30 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <span className="text-[#c9a84c]">{filteredProducts.length.toLocaleString()}</span> relojes
            </div>
          )}
        </div>

        {/* Grid / Lista de productos */}
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
                {filteredProducts.slice(0, visibleCount).map((product: any, idx) => (
                  <ProductCard
                    key={product.title + idx}
                    product={product}
                    viewMode={viewMode}
                    isFav={favs.includes(product.slug || slugify(product.title))}
                    onToggleFav={toggleFav}
                  />
                ))}
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/producto/:slug" element={<ProductPage />} />
    </Routes>
  );
}

export default App;
