-- Create products table for Royal Watch
create table if not exists public.rw_products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  price text not null,
  price_numeric numeric not null,
  img text,
  category text not null,
  slug text unique not null,
  description text,
  specs jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.rw_products enable row level security;

drop policy if exists "Allow public read access" on public.rw_products;
-- Create policy to allow public read access
create policy "Allow public read access"
  on public.rw_products for select
  using (true);

drop policy if exists "Allow public insert access" on public.rw_products;
-- Create policy to allow public insert access (for migration)
create policy "Allow public insert access"
  on public.rw_products for insert
  with check (true);

-- Create policy to allow public update access (for migration)
create policy "Allow public update access"
  on public.rw_products for update
  using (true)
  with check (true);
