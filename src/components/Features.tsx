import { motion } from 'framer-motion';

export const Features = () => {
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
