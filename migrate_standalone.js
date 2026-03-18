import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no encontradas en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productsPath = path.join(__dirname, 'src', 'data', 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const num = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(num) || 0;
}

async function migrate() {
  console.log('🚀 Iniciando migración a rw_products...');
  
  const formattedProducts = productsData.map(p => ({
    title: p.title,
    price: p.price,
    price_numeric: parsePrice(p.price),
    img: p.img,
    category: p.category,
    slug: p.slug || slugify(p.title),
    description: p.description || 'Maquinaria de movimiento continuo, cristal de zafiro anti-rayas y acero quirúrgico 316L. Réplica 1:1 con materiales idénticos al original.',
    specs: {
       ...p.specs,
       images: p.images || []
    }
  }));

  // Deduplicate before upserting (Postgres doesn't allow duplicate keys in the same batch)
  const uniqueProducts = [];
  const slugs = new Set();
  
  for (const product of formattedProducts) {
    if (!slugs.has(product.slug)) {
      slugs.add(product.slug);
      uniqueProducts.push(product);
    }
  }

  console.log(`📦 Procesando ${uniqueProducts.length} productos únicos (de ${formattedProducts.length} totales)...`);

  const chunkSize = 50;
  for (let i = 0; i < uniqueProducts.length; i += chunkSize) {
    const chunk = uniqueProducts.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('rw_products')
      .upsert(chunk, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error en el chunk ${i / chunkSize}:`, JSON.stringify(error, null, 2));
      console.log('Tip: Asegúrate de tener una política de INSERT habilitada para anon en rw_products.');
    } else {
      console.log(`✅ Chunk ${i / chunkSize} (${chunk.length} items) sincronizado.`);
    }
  }

  console.log('🏁 Migración finalizada.');
}

migrate();
