import axios from 'axios';
import * as cheerio from 'cheerio';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

async function testExtraction() {
  const url = 'https://trustywatches.com/product/replica-del-reloj-audemars-piguet-royal-oak-26574st-esfera-verde-41-mm/';
  console.log('Testing extraction for:', url);
  
  try {
    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);
    const images = [];
    
    // Selectores mejorados
    const selectors = [
      '.woocommerce-product-gallery__image img',
      '.product-images img',
      '.product-thumbnails img'
    ];
    
    $(selectors.join(',')).each((i, el) => {
      let src = $(el).attr('data-large_image') || $(el).attr('data-src') || $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        console.log(`Found: ${src}`);
        // Limpieza HD
        if (src.includes('-100x100')) src = src.replace('-100x100', '');
        if (src.includes('-350x467')) src = src.replace('-350x467', '');
        if (src.includes('-600x800')) src = src.replace('-600x800', '');
        if (!images.includes(src)) images.push(src);
      }
    });
    
    console.log('\nFinal HD Gallery:', images);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testExtraction();
