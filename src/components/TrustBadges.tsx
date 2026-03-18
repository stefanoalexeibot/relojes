import { motion } from 'framer-motion';

const badges = [
  {
    icon: '🛡️',
    title: 'Garantía de Aduana',
    desc: 'Reenvío 100% gratuito si hay problemas en aduana.'
  },
  {
    icon: '🧬',
    title: 'Calidad 1:1',
    desc: 'Materiales y pesos idénticos al modelo original.'
  },
  {
    icon: '✈️',
    title: 'Envío Express VIP',
    desc: 'Entrega asegurada de 3 a 5 días hábiles.'
  },
  {
    icon: '💎',
    title: 'Cristal de Zafiro',
    desc: 'Anti-rayaduras con recubrimiento AR premium.'
  }
];

export const TrustBadges = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {badges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-[#111] border border-white/5 p-4 rounded-3xl flex items-start gap-4 hover:border-[#c9a84c]/20 transition-all group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">{badge.icon}</span>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">{badge.title}</h4>
            <p className="text-white/40 text-[11px] leading-tight font-medium">{badge.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
