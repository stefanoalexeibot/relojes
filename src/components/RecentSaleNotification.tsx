import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const locations = ['Ciudad de México', 'Monterrey', 'Guadalajara', 'Querétaro', 'Puebla', 'Cancún', 'Mérida'];
const items = ['Rolex Submariner', 'Patek Philippe Nautilus', 'Audemars Piguet Royal Oak', 'Cartier Santos', 'Omega Seamaster'];

export const RecentSaleNotification = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', item: '' });

  useEffect(() => {
    const showNotification = () => {
      setData({
        name: ['Juan', 'Pedro', 'Sofía', 'Carlos', 'Ana', 'Luis'][Math.floor(Math.random() * 6)],
        city: locations[Math.floor(Math.random() * locations.length)],
        item: items[Math.floor(Math.random() * items.length)]
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const timer = setInterval(() => {
      if (Math.random() > 0.7) showNotification();
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-8 left-8 z-[100] bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-[24px] shadow-2xl flex items-center gap-4 max-w-[320px]"
        >
          <div className="w-12 h-12 bg-[#c9a84c]/10 rounded-full flex items-center justify-center text-xl shrink-0">
            ⌚
          </div>
          <div>
            <p className="text-[10px] text-[#c9a84c] font-black uppercase tracking-widest mb-0.5">Venta Reciente</p>
            <p className="text-white text-xs font-bold leading-tight">
              {data.name} en <span className="text-[#c9a84c]">{data.city}</span> acaba de cotizar un {data.item}
            </p>
          </div>
          <button onClick={() => setVisible(false)} className="text-white/20 hover:text-white ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
