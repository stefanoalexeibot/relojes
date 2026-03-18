import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const gallery = images && images.length > 0 ? images : [];

  if (gallery.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="aspect-square bg-[#0a0a0a] rounded-[48px] flex items-center justify-center border border-white/5">
          <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Sin imagen disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Main viewer */}
      <div
        className="relative aspect-square bg-[#0a0a0a] rounded-[40px] overflow-hidden border border-white/5 group cursor-zoom-in"
        onClick={() => setZoomed(!zoomed)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={gallery[activeIdx]}
            src={gallery[activeIdx]}
            alt={`${title} - View ${activeIdx + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover transition-transform"
          />
        </AnimatePresence>

        {/* Floating badge */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
          <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">
            {zoomed ? 'Toca para alejar' : 'Toca para acercar'}
          </p>
        </div>

        {/* Multiple image arrow navigation */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i => (i - 1 + gallery.length) % gallery.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i => (i + 1) % gallery.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails — only show if multiple images */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {gallery.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                activeIdx === idx ? 'border-[#c9a84c] shadow-[0_0_15px_rgba(201,168,76,0.3)]' : 'border-white/5 opacity-40 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
          {gallery.length > 5 && (
            <div className="aspect-square bg-[#111] rounded-2xl flex items-center justify-center border border-white/5">
              <p className="text-[10px] text-white/40 font-bold">+{gallery.length - 5}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
