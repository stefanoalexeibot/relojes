import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const categories = [
  'https://trustywatches.com/product-category/rolex/submariner/',
  'https://trustywatches.com/product-category/cartier/santos/',
  'https://trustywatches.com/product-category/omega/seamaster/',
  'https://trustywatches.com/product-category/audemars-piguet/audemars-piguet-royal-oak/'
];

async function scrapeCategory(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000
    });
    const $ = cheerio.load(data);
    const products = [];

    $('.product').each((i, el) => {
      const title = $(el).find('.woocommerce-loop-product__title').text().trim();
      let price = $(el).find('.price ins .woocommerce-Price-amount').text().trim();
      if (!price) {
        price = $(el).find('.price .woocommerce-Price-amount').first().text().trim();
      }
      const link = $(el).find('a').attr('href');
      
      // Try multiple image attributes due to lazy loading
      const imgElement = $(el).find('img');
      const img = imgElement.attr('data-src') || 
                  imgElement.attr('data-lazy-src') || 
                  imgElement.attr('srcset')?.split(' ')[0] || 
                  imgElement.attr('src');

      // Map technical category slugs to beautiful names
      const categoryMap = {
        'submariner': 'Rolex Submariner',
        'santos': 'Cartier Santos',
        'seamaster': 'Omega Seamaster',
        'audemars-piguet-royal-oak': 'AP Royal Oak'
      };
      
      const rawCategory = url.split('/').filter(Boolean).pop();
      const category = categoryMap[rawCategory] || rawCategory;

      if (title && (price || title.includes('Replica'))) {
        products.push({ 
          title, 
          price: price || 'Consultar', 
          link, 
          img, 
          category 
        });
      }
    });

    return products;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return [];
  }
}

async function main() {
  let allProducts = [];
  for (const url of categories) {
    console.log(`Scraping ${url}...`);
    const products = await scrapeCategory(url);
    allProducts = [...allProducts, ...products];
  }

  fs.writeFileSync('./src/data/products.json', JSON.stringify(allProducts, null, 2));
  console.log(`Scraped ${allProducts.length} products total.`);
}

main();
