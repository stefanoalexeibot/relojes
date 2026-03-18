import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

async function scrapeDetail(url) {
  try {
    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);
    const images = [];
    $('.woocommerce-product-gallery__image img').each((_i, el) => {
      let src = $(el).attr('data-large_image') || $(el).attr('data-src') || $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        if (src.includes('-100x100')) src = src.replace('-100x100', '');
        if (src.includes('-350x467')) src = src.replace('-350x467', '');
        if (src.includes('-600x800')) src = src.replace('-600x800', '');
        if (!images.includes(src)) images.push(src);
      }
    });
    return images;
  } catch (e) {
    console.error('Error scraping:', e.message);
    return [];
  }
}

const url = 'https://trustywatches.com/product/hot-selling-modelaudemars-piguet-royal-oak-15450-ss-ss-blue-dial-jap-quartz/';
scrapeDetail(url).then(images => {
  if (images.length === 0) {
    console.log('No images found or error occurred.');
    return;
  }
  const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));
  const idx = products.findIndex(p => p.slug === 'hot-selling-modelaudemars-piguet-royal-oak-15450-ss-ss-blue-dial-jap-quartz');
  if (idx !== -1) {
    products[idx].images = images;
    fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
    console.log(`✅ Success! Injected ${images.length} real HD images into JSON for testing.`);
  } else {
    console.log('Product slug not found in JSON.');
  }
});
