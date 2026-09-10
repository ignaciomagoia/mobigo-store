-- 1. Primero crea el usuario en Supabase Auth > Users.
-- 2. Reemplaza el email de abajo por el email real del primer administrador.
-- 3. Ejecuta este archivo en SQL Editor.

insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'admin@tu-dominio.com'
on conflict (user_id) do update
set email = excluded.email;
