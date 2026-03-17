-- Create products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  price text not null,
  price_numeric numeric not null,
  img text,
  category text not null,
  slug text unique not null,
  link text,
  description text,
  specs jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access" on public.products
  for select using (true);
