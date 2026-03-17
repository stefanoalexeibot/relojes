import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import productsData from '../data/products.json';

export const Hero = () => (
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
