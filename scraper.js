import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

// ─── Configuración ───────────────────────────────────────────────────────────
const DELAY_MS = 1200; // pausa entre requests para no ser bloqueado
const MAX_PAGES = 10;  // máximo de páginas por categoría

const categories = [
  // Rolex
  { url: 'https://trustywatches.com/product-category/rolex/submariner/',       name: 'Rolex Submariner' },
  { url: 'https://trustywatches.com/product-category/rolex/datejust/',         name: 'Rolex Datejust' },
  { url: 'https://trustywatches.com/product-category/rolex/daytona/',          name: 'Rolex Daytona' },
  { url: 'https://trustywatches.com/product-category/rolex/gmt-master/',       name: 'Rolex GMT-Master' },
  { url: 'https://trustywatches.com/product-category/rolex/day-date/',         name: 'Rolex Day-Date' },
  // Cartier
  { url: 'https://trustywatches.com/product-category/cartier/santos/',         name: 'Cartier Santos' },
  { url: 'https://trustywatches.com/product-category/cartier/tank/',           name: 'Cartier Tank' },
  { url: 'https://trustywatches.com/product-category/cartier/ballon-bleu/',    name: 'Cartier Ballon Bleu' },
  // Omega
  { url: 'https://trustywatches.com/product-category/omega/seamaster/',        name: 'Omega Seamaster' },
  { url: 'https://trustywatches.com/product-category/omega/speedmaster/',      name: 'Omega Speedmaster' },
  { url: 'https://trustywatches.com/product-category/omega/constellation/',    name: 'Omega Constellation' },
  // Audemars Piguet
  { url: 'https://trustywatches.com/product-category/audemars-piguet/audemars-piguet-royal-oak/', name: 'AP Royal Oak' },
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xhtml+xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Generar slug único desde el título ──────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

// ─── Scrape de una sola página de categoría ───────────────────────────────────
async function scrapeCategoryPage(url, categoryName) {
  try {
    const { data } = await axios.get(url, { headers, timeout: 20000 });
    const $ = cheerio.load(data);
    const products = [];

    $('.product').each((i, el) => {
      const title = $(el).find('.woocommerce-loop-product__title').text().trim();

      // Precio: primero intenta precio de oferta, luego precio regular
      let price = $(el).find('.price ins .woocommerce-Price-amount').text().trim();
      if (!price) {
        price = $(el).find('.price .woocommerce-Price-amount').first().text().trim();
      }

      // Link real del producto (href del título/imagen principal)
      const link = $(el).find('a.woocommerce-LoopProduct-link').attr('href')
                || $(el).find('a').first().attr('href')
                || null;

      // Imagen principal con múltiples fallbacks para lazy loading
      const imgEl = $(el).find('img');
      const img = imgEl.attr('data-large_image')
               || imgEl.attr('data-src')
               || imgEl.attr('data-lazy-src')
               || imgEl.attr('srcset')?.split(' ')[0]
               || imgEl.attr('src')
               || null;

      if (title) {
        products.push({
          title,
          price: price || 'Consultar',
          link: link || null,
          img: img || null,
          category: categoryName,
          slug: slugify(title),
        });
      }
    });

    // Detectar si hay página siguiente
    const hasNextPage = $('a.next.page-numbers').length > 0;
    return { products, hasNextPage };

  } catch (error) {
    console.error(`  ✗ Error en ${url}: ${error.message}`);
    return { products: [], hasNextPage: false };
  }
}

// ─── Scrape de todas las páginas de una categoría ────────────────────────────
async function scrapeCategory({ url, name }) {
  console.log(`\n📂 Categoría: ${name}`);
  let allProducts = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const pageUrl = page === 1 ? url : `${url}page/${page}/`;
    console.log(`  → Página ${page}: ${pageUrl}`);

    const { products, hasNextPage } = await scrapeCategoryPage(pageUrl, name);
    allProducts = [...allProducts, ...products];
    console.log(`    ✓ ${products.length} productos encontrados`);

    if (!hasNextPage || products.length === 0) break;
    await sleep(DELAY_MS);
  }

  console.log(`  Total ${name}: ${allProducts.length} productos`);
  return allProducts;
}

// ─── Scrape del detalle de cada producto ─────────────────────────────────────
async function scrapeProductDetail(url) {
  if (!url || url === 'null' || url.startsWith('javascript')) return {};

  try {
    const { data } = await axios.get(url, { headers, timeout: 20000 });
    const $ = cheerio.load(data);

    // Todas las imágenes de la galería
    const images = [];
    $('.woocommerce-product-gallery__image img').each((_i, el) => {
      const src = $(el).attr('data-large_image')
               || $(el).attr('data-src')
               || $(el).attr('src');
      if (src && !src.startsWith('data:') && !images.includes(src)) {
        images.push(src);
      }
    });

    // Descripción corta
    const description = $('.woocommerce-product-details__short-description p').first().text().trim()
                     || $('.entry-summary p').first().text().trim()
                     || '';

    // Descripción completa (tab)
    const fullDescription = $('#tab-description p').first().text().trim() || '';

    // Especificaciones técnicas de la tabla
    const specs = {};
    $('table.shop_attributes tr, .woocommerce-product-attributes tr').each((_i, el) => {
      const key = $(el).find('th, .woocommerce-product-attributes-item__label').text().trim();
      const val = $(el).find('td, .woocommerce-product-attributes-item__value').text().trim();
      if (key && val) specs[key] = val;
    });

    return {
      images: images.length > 0 ? images : undefined,
      description: description || fullDescription || undefined,
      specs: Object.keys(specs).length > 0 ? specs : undefined,
    };

  } catch (error) {
    console.error(`    ✗ Error detalle: ${error.message}`);
    return {};
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Iniciando scraper Royal Watch...\n');
  const startTime = Date.now();

  // 1. Scrape de todas las categorías y páginas
  let allProducts = [];
  for (const cat of categories) {
    const products = await scrapeCategory(cat);
    allProducts = [...allProducts, ...products];
    await sleep(DELAY_MS);
  }

  console.log(`\n📦 Total de productos encontrados: ${allProducts.length}`);

  // 2. Scrape de detalle de cada producto
  console.log('\n🔍 Obteniendo detalles de cada producto...');
  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    process.stdout.write(`  [${i + 1}/${allProducts.length}] ${p.title.substring(0, 50)}...`);

    if (p.link) {
      const detail = await scrapeProductDetail(p.link);
      if (detail.images) allProducts[i].images = detail.images;
      if (detail.description) allProducts[i].description = detail.description;
      if (detail.specs) allProducts[i].specs = detail.specs;
      process.stdout.write(' ✓\n');
    } else {
      process.stdout.write(' (sin link)\n');
    }

    // Guardar progreso parcial cada 10 productos
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync('./src/data/products.json', JSON.stringify(allProducts, null, 2));
      console.log(`  💾 Guardado parcial: ${i + 1} productos`);
    }

    await sleep(DELAY_MS);
  }

  // 3. Guardar resultado final
  fs.writeFileSync('./src/data/products.json', JSON.stringify(allProducts, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n✅ Listo! ${allProducts.length} productos guardados en src/data/products.json`);
  console.log(`⏱  Tiempo total: ${elapsed} minutos`);
}

main();
