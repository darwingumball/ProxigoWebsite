-- Hardware orders (one-time Stripe payments)
create table if not exists public.orders (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid references public.profiles(id) on delete set null,
  stripe_session_id      text unique,
  stripe_payment_intent  text,
  product_name           text not null,
  amount_cents           integer not null,
  currency               text not null default 'usd',
  status                 text not null default 'pending'
                           check (status in ('pending', 'paid', 'refunded', 'failed')),
  receipt_url            text,
  created_at             timestamptz default now()
);

alter table public.orders enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'orders' and policyname = 'Users can view own orders'
  ) then
    create policy "Users can view own orders"
      on public.orders for select
      using (auth.uid() = user_id);
  end if;
end $$;

create index if not exists idx_orders_user on public.orders (user_id, created_at desc);
