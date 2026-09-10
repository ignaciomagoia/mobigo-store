-- Ejecutar en Supabase SQL Editor despues de crear public.products.
-- No usa service_role en el frontend. Los administradores se habilitan en public.admin_users.

begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from public, anon, authenticated;
grant select on table public.admin_users to authenticated;
grant all on table public.admin_users to service_role;

drop policy if exists admin_users_self_read on public.admin_users;
create policy admin_users_self_read
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

alter table public.products drop constraint if exists products_condition_check;
update public.products
set condition = 'Sellado'
where condition = 'Nuevo';
alter table public.products
  add constraint products_condition_check check (condition in ('Sellado', 'Usado')) not valid;
alter table public.products validate constraint products_condition_check;

alter table public.products enable row level security;

revoke all on table public.products from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;
grant all on table public.products to service_role;

drop policy if exists products_public_active_read on public.products;
drop policy if exists products_admin_read on public.products;
drop policy if exists products_admin_insert on public.products;
drop policy if exists products_admin_update on public.products;
drop policy if exists products_admin_delete on public.products;

create policy products_public_active_read
  on public.products for select
  to anon, authenticated
  using (active = true);

create policy products_admin_read
  on public.products for select
  to authenticated
  using (public.is_admin());

create policy products_admin_insert
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy products_admin_update
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy products_admin_delete
  on public.products for delete
  to authenticated
  using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_images_public_read on storage.objects;
drop policy if exists product_images_admin_insert on storage.objects;
drop policy if exists product_images_admin_update on storage.objects;
drop policy if exists product_images_admin_delete on storage.objects;

create policy product_images_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy product_images_admin_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy product_images_admin_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy product_images_admin_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

commit;
