-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  plan            text check (plan in ('starter', 'pro', 'enterprise')),
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  created_at      timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Modules
create table public.modules (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  serial        text not null unique,
  nickname      text,
  status        text not null default 'active' check (status in ('active', 'inactive', 'revoked')),
  registered_at timestamptz default now()
);

alter table public.modules enable row level security;
create policy "Users can manage own modules" on public.modules
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Usage events
create table public.usage_events (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  module_id   uuid not null references public.modules(id) on delete cascade,
  km2         numeric not null check (km2 > 0),
  session_id  text,
  created_at  timestamptz default now()
);

alter table public.usage_events enable row level security;
create policy "Users can view own usage" on public.usage_events
  for select using (auth.uid() = user_id);
create policy "Service role can insert usage" on public.usage_events
  for insert with check (auth.uid() = user_id);

create index idx_usage_events_user_month
  on public.usage_events (user_id, created_at desc);

-- Support tickets
create table public.support_tickets (
  id          uuid primary key default uuid_generate_v4(),
  ticket_id   text not null unique,
  user_id     uuid references public.profiles(id) on delete set null,
  name        text not null,
  email       text not null,
  category    text not null,
  subject     text not null,
  message     text not null,
  status      text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.support_tickets enable row level security;
create policy "Users can view own tickets" on public.support_tickets
  for select using (auth.uid() = user_id);
