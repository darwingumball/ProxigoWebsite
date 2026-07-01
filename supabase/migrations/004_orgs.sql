-- Organizations and shared quota pools
create table public.orgs (
  id                      uuid primary key default uuid_generate_v4(),
  name                    text not null,
  owner_user_id           uuid not null references auth.users(id) on delete cascade,
  plan                    text not null default 'starter' check (plan in ('starter', 'pro', 'enterprise')),
  stripe_subscription_id  text,
  km2_limit               integer not null default 500,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create table public.org_members (
  org_id          uuid not null references public.orgs(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  role            text not null default 'member' check (role in ('admin', 'member')),
  km2_allowance   integer,  -- per-member monthly cap within pool; null = no individual cap
  joined_at       timestamptz default now(),
  primary key (org_id, user_id)
);

-- RLS
alter table public.orgs enable row level security;
alter table public.org_members enable row level security;

-- Org: any member can read the org row
create policy "org members can view org" on public.orgs
  for select using (
    owner_user_id = auth.uid()
    or id in (select org_id from public.org_members where user_id = auth.uid())
  );

-- Org: owner can update
create policy "org owner can update org" on public.orgs
  for update using (owner_user_id = auth.uid());

-- Org members: any member can see the full member list
create policy "org members can view member list" on public.org_members
  for select using (
    org_id in (select org_id from public.org_members where user_id = auth.uid())
  );

-- Org admins can insert / update / delete members
create policy "org admins can manage members" on public.org_members
  for all using (
    org_id in (
      select org_id from public.org_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Allow org members to read each other's usage for pool accounting
create policy "org members can view org usage" on public.usage_events
  for select using (
    auth.uid() = user_id
    or user_id in (
      select om2.user_id
      from public.org_members om1
      join public.org_members om2 on om1.org_id = om2.org_id
      where om1.user_id = auth.uid()
    )
  );

-- Auto-add org owner as admin member when org is created
create or replace function public.handle_org_created()
returns trigger language plpgsql security definer as $$
begin
  insert into public.org_members (org_id, user_id, role)
  values (new.id, new.owner_user_id, 'admin');
  return new;
end;
$$;

create trigger on_org_created
  after insert on public.orgs
  for each row execute procedure public.handle_org_created();

create index idx_org_members_org_id  on public.org_members (org_id);
create index idx_org_members_user_id on public.org_members (user_id);
