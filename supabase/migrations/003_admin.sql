-- Add admin flag and email cache to profiles
alter table public.profiles
  add column if not exists is_admin boolean not null default false,
  add column if not exists email    text;

-- Back-fill email from auth.users for existing rows
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- Keep email in sync on new signups
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email     = excluded.email;
  return new;
end;
$$;

-- Tables referenced by admin pages (created here since admin is the only consumer)
create table if not exists public.organizations (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  owner_id   uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.organizations enable row level security;

create table if not exists public.module_inventory (
  id         uuid primary key default uuid_generate_v4(),
  serial     text not null unique,
  batch      text,
  status     text not null default 'unassigned'
               check (status in ('unassigned', 'assigned', 'returned', 'defective')),
  created_at timestamptz default now()
);

alter table public.module_inventory enable row level security;
