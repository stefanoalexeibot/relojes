import { supabase } from './supabase';
import productsData from '../data/products.json';
import { slugify, parsePrice } from './utils';

export async function migrate() {
  console.log('Starting migration...');
  
  const formattedProducts = (productsData as any[]).map((p: any) => ({
    title: p.title,
    price: p.price,
    price_numeric: parsePrice(p.price),
    img: p.img,
    category: p.category,
    slug: p.slug || slugify(p.title),
    // Link is not in the schema, but we can store it in specs or description if needed
    // For now, let's stick to the schema in supabase_schema.sql
    description: p.description || 'Maquinaria de movimiento continuo, cristal de zafiro anti-rayas y acero quirúrgico 316L. Réplica 1:1 con materiales idénticos al original.',
    specs: p.specs || {}
  }));

  const { data, error } = await supabase
    .from('rw_products')
    .upsert(formattedProducts, { onConflict: 'slug' });

  if (error) {
    console.error('Migration error:', error);
  } else {
    console.log('Migration successful!', data);
  }
}
