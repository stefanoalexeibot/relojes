import { useState, useCallback } from 'react';

export function useFavorites() {
  const [favs, setFavs] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('rw_favs') || '[]');
    } catch {
      return [];
    }
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
