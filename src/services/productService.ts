import { supabase } from '../lib/supabase';

export interface Product {
  id: string;
  title: string;
  price: string;
  price_numeric: number;
  img: string | null;
  category: string;
  slug: string;
  description: string;
  specs: Record<string, any>;
  created_at: string;
}

export const productService = {
  async getProducts() {
    const { data, error } = await supabase
      .from('rw_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Product[];
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('rw_products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Product;
  }
};
