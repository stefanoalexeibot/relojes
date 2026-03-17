import { supabase } from '../lib/supabase';

export interface Product {
  id?: string;
  title: string;
  price: string;
  img: string | null;
  category: string;
  slug: string;
  link: string | null;
  description: string;
  specs: any;
  created_at?: string;
}

export const productService = {
  async getProducts(filter = 'all', search = '', priceMin = 0, priceMax = 100000) {
    let query = supabase
      .from('products')
      .select('*');

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Note: prices are currently stored as strings in JSON like "MX$1,500"
    // For efficient filtering, they should be numeric in DB.
    // Assuming we convert them to numeric during migration.
    query = query.gte('price_numeric', priceMin).lte('price_numeric', priceMax);

    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Product;
  },

  async getRelatedProducts(category: string, currentSlug: string, limit = 4) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('slug', currentSlug)
      .limit(limit);

    if (error) throw error;
    return data as Product[];
  }
};
