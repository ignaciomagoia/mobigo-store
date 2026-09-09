-- Ejecutar completo en el SQL Editor del proyecto Supabase.
-- Crea una tabla nueva; no migra una tabla existente con otra estructura.
begin;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  category text not null check (category in ('iphones', 'apple-watch', 'airpods', 'accesorios')),
  model text,
  capacity text,
  color text,
  condition text not null check (condition in ('Nuevo', 'Usado')),
  battery_health integer check (battery_health between 0 and 100),
  price_usd numeric(12,2) not null check (price_usd >= 0),
  price_ars numeric(16,2) check (price_ars >= 0),
  description text,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_active_catalog_idx
  on public.products (featured desc, created_at desc, id) where active = true;

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_products_updated_at();

alter table public.products enable row level security;

-- El navegador solo puede leer. No tiene permisos de escritura.
revoke all on table public.products from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant all on table public.products to service_role;

drop policy if exists products_public_active_read on public.products;
create policy products_public_active_read
  on public.products for select
  to anon, authenticated
  using (active = true);

commit;
