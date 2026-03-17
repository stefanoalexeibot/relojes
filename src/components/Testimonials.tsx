import { motion } from 'framer-motion';

export const Testimonials = () => {
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
