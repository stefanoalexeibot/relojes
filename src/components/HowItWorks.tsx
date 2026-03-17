import { motion } from 'framer-motion';

export const HowItWorks = () => {
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
