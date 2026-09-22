alter table public.products
  add column if not exists max_installments integer not null default 6;

alter table public.products
  drop constraint if exists products_max_installments_check;

alter table public.products
  add constraint products_max_installments_check
  check (max_installments between 1 and 18);
