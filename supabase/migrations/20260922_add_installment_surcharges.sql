alter table public.products
  add column if not exists installment_surcharges jsonb not null default '{}'::jsonb;
